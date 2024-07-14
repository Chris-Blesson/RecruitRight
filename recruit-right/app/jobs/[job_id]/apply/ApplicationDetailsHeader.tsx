"use client";

import { Radio } from "antd";
import { useApplicationDetailsContext } from "./ApplicationDetailsContext";

const ApplicationDetailsHeader = () => {
  const {
    questions,
    setCurrentSelectedQuestionIndex,
    currentSelectedQuestionIndex,
  } = useApplicationDetailsContext();

  const onChange = (e) => {
    setCurrentSelectedQuestionIndex(e.target.value);
  };
  return (
    <Radio.Group onChange={onChange} value={currentSelectedQuestionIndex}>
      {questions.map((_, idx) => {
        return (
          <Radio.Button value={idx} key={idx}>
            Question {idx + 1}
          </Radio.Button>
        );
      })}
    </Radio.Group>
  );
};

export default ApplicationDetailsHeader;
