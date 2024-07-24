"use client";
import { useAccountsContext } from "@/app/components/AccountsContext";
import { message } from "antd";
import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
// import { toast } from "react-toastify";
const AnswerContext = createContext({
  answers: {},
  setAnswer: (index) => {},
  onSaveHandler: (onSaveNotification?: () => void) => {},
  onSubmissionEndHandler: (onContestEndNotification?: () => {}) => {},
  isLoading: false,
});

export const useAnswerContext = () => {
  const contextValues = useContext(AnswerContext);
  return {
    ...contextValues,
  };
};

const AnswerContextProvider = ({ children, jobId }) => {
  /**
   * {
   * "question 1" :"Question 1's answer"
   * }
   */
  const [answer, setAnswer] = useState({});
  const [isInitialAnswerFetching, setIsInitialAnswerFetching] = useState(false);
  const { changeSidebarView } = useAccountsContext();
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const onSaveHandler = useCallback(
    async (onSaveNotification?: (response: any) => void) => {
      const requestBody = {
        jobId,
        testResponse: answer,
      };
      setIsLoading(true);
      fetch("/api/submission/save", {
        method: "POST",
        body: JSON.stringify(requestBody),
      })
        .then((response) => {
          onSaveNotification?.(response);
        })
        .catch((err) => {
          throw new Error("Error in answer context");
        })
        .finally(() => {
          setSubmitted(true);
          setIsLoading(false);
        });
    },
    [answer]
  );

  const onSubmissionEndHandler = useCallback(
    (onContestEndNotification?: (response: any) => void) => {
      const requestBody = {
        jobId,
        testResponse: answer,
      };
      setIsLoading(true);
      fetch("/api/submission/end", {
        method: "POST",
        body: JSON.stringify(requestBody),
      })
        .then((response) => {
          onContestEndNotification?.(response);
          message.success("Please wait while we redirect to jobs page");
          setTimeout(() => {
            router.replace("/jobs");
            changeSidebarView({ open: true });
          }, 1000);
        })
        .catch((err) => {
          message.error(
            "Something went wrong, don't worry your answers are safe with us!"
          );
          console.log("error in answer context", err);
          throw new Error("Error in answer context");
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [answer]
  );

  const savedAnswerFetcher = () => {
    setIsInitialAnswerFetching(true);
    setIsLoading(true);
    fetch(`/api/submission/${jobId}/answer`, {
      cache: "no-store",
    })
      .then((response) => {
        //@ts-ignore
        setAnswer(response.answers || {});
      })
      .catch(() => {
        setAnswer({});
      })
      .finally(() => {
        setIsInitialAnswerFetching(false);
        setIsLoading(false);
      });
  };
  useEffect(() => {
    savedAnswerFetcher();
  }, []);

  if (isInitialAnswerFetching) {
    return <p>Loading...</p>;
  }

  return (
    <AnswerContext.Provider
      value={{
        answers: answer,
        setAnswer,
        onSaveHandler,
        onSubmissionEndHandler,
        isLoading,
      }}
    >
      {children}
    </AnswerContext.Provider>
  );
};

export default AnswerContextProvider;
