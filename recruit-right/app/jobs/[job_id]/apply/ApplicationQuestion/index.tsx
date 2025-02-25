"use client";
import { useApplicationDetailsContext } from "../ApplicationDetailsContext";

const ApplicationQuestion = () => {
  const { currentSelectedQuestionIndex, questions } =
    useApplicationDetailsContext();
  const questionDetails = questions[currentSelectedQuestionIndex];

  return (
    <div>
      <p>{questionDetails}</p>
    </div>
  );
};

export default ApplicationQuestion;
