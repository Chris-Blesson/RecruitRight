"use client";
import { Button, message, Modal } from "antd";

import Link from "next/link";
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
  const [submitted, setSubmitted] = useState(false);
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);

  const onSaveHandler = useCallback(
    async (onSaveNotification?: (response: any) => void) => {
      const requestBody = {
        jobId,
        testResponse: answer,
      };

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
        });
    },
    [answer]
  );

  const onSubmissionEndHandler = useCallback(
    (onContestEndNotification?: (response: any) => void) => {
      setIsSubmissionModalOpen(true);
      const requestBody = {
        jobId,
        testResponse: answer,
      };
      fetch("/api/submission/end", {
        method: "POST",
        body: JSON.stringify(requestBody),
      })
        .then((response) => {
          onContestEndNotification?.(response);
        })
        .catch((err) => {
          message.error(
            "Something went wrong, don't worry your answers are safe with us!"
          );
          console.log("error in answer context", err);
          throw new Error("Error in answer context");
        })
        .finally(() => {
          setIsSubmissionModalOpen(false);
        });
    },
    [answer]
  );

  const savedAnswerFetcher = () => {
    setIsInitialAnswerFetching(true);
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
      }}
    >
      {children}
      <Modal
        closable={false}
        closeIcon={<></>}
        footer={<></>}
        open={isSubmissionModalOpen}
      >
        <>
          {submitted ? (
            <p className="text-md">
              You have successfully completed the contest
            </p>
          ) : (
            <p className="text-md">
              Your answers are being evaluated... You can view the status of the
              submission in your profile page
            </p>
          )}
          <Link href={"/contests"}>
            <Button
              color="primary"
              onClick={() => {
                setIsSubmissionModalOpen(false);
              }}
              loading={!submitted}
              disabled={!submitted}
            >
              View my profile
            </Button>
          </Link>
        </>
      </Modal>
    </AnswerContext.Provider>
  );
};

export default AnswerContextProvider;
