"use client";

import { Radio } from "antd";
import { useApplicationDetailsContext } from "./ApplicationDetailsContext";

const ApplicationDetailsHeader = () => {
  const {
    questions,
    setCurrentSelectedQuestion,
    currentSelectedQuestionIndex,
  } = useApplicationDetailsContext();

  const onChange = (e) => {
    setCurrentSelectedQuestion(e.target.value);
  };
  return (
    <Radio.Group onChange={onChange} value={currentSelectedQuestionIndex}>
      {questions.map((question, idx) => {
        return (
          <Radio.Button value={idx} key={idx}>
            {question.text}
          </Radio.Button>
        );
      })}
    </Radio.Group>
  );
};

export default ApplicationDetailsHeader;
