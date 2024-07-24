"use client";
import { Button, message } from "antd";
import { useAnswerContext } from "../AnswerContext";
import { useApplicationDetailsContext } from "../ApplicationDetailsContext";
import clsx from "clsx";

const Footer = () => {
  const {
    currentSelectedQuestionIndex,
    questions,
    setCurrentSelectedQuestionIndex,
  } = useApplicationDetailsContext();
  const { onSaveHandler, onSubmissionEndHandler, isLoading } =
    useAnswerContext();

  const totalNoOfQuestions = questions.length;
  const isSaveAndNext = currentSelectedQuestionIndex < totalNoOfQuestions - 1;
  return (
    <div className="flex justify-between">
      <Button
        color="secondary"
        disabled={currentSelectedQuestionIndex === 0}
        onClick={(e) => {
          e.stopPropagation();
          setCurrentSelectedQuestionIndex(currentSelectedQuestionIndex - 1);
        }}
        className={clsx(
          totalNoOfQuestions > 1 && currentSelectedQuestionIndex !== 0
            ? "visible"
            : "invisible"
        )}
      >
        Previous
      </Button>
      <Button
        color="primary"
        onClick={(e) => {
          e.stopPropagation();
          if (isSaveAndNext) {
            onSaveHandler();
            setCurrentSelectedQuestionIndex(currentSelectedQuestionIndex + 1);
          } else {
            //Trigger submit call
            onSubmissionEndHandler();
          }
        }}
        loading={isLoading}
        disabled={isLoading}
      >
        {!isSaveAndNext ? "Submit" : "Save & Next"}
      </Button>
    </div>
  );
};

export default Footer;
