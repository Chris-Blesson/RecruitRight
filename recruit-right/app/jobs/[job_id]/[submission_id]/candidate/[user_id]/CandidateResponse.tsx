"use client";

import { Collapse } from "antd";

const CandidateResponse = ({ testResponse }) => {
  const questionAndAnswer = Object.keys(testResponse.response).map(
    (question) => {
      return {
        question,
        answer: testResponse.response[question],
      };
    }
  );

  const collapsibleContent = questionAndAnswer.map(
    (questionAndAnswerPair, idx) => {
      const questionLabel = questionAndAnswerPair.question;
      const answer = questionAndAnswerPair.answer;

      return {
        label: questionLabel,
        key: idx,
        children: <p>{answer}</p>,
      };
    }
  );
  return (
    <div>
      <Collapse items={collapsibleContent} defaultActiveKey={["0"]} accordion />
    </div>
  );
};

export default CandidateResponse;
