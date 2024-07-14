"use client";
import TextArea from "antd/es/input/TextArea";
import { useAnswerContext } from "../AnswerContext";
import { useApplicationDetailsContext } from "../ApplicationDetailsContext";

const ApplicationAnswer = () => {
  const { currentSelectedQuestionIndex, questions } =
    useApplicationDetailsContext();
  const { answers, setAnswer } = useAnswerContext();
  const questionDetails = questions[currentSelectedQuestionIndex];
  const questionText = questionDetails.text;
  const onChangeOfAnswer = (currentState) => {
    setAnswer((currentAnswerState) => {
      return {
        ...currentAnswerState,
        [questionText]: currentState,
      };
    });
  };
  return (
    <TextArea
      value={answers[questionText]}
      onChange={(e) => onChangeOfAnswer(e.target.value)}
      placeholder="Enter your response"
      autoSize={{ minRows: 3, maxRows: 5 }}
    />
  );
};

export default ApplicationAnswer;
