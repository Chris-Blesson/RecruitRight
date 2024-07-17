import { Progress } from "antd";
import React from "react";

// const getProgressStatus = (score) => {
//   if (Number(score) >= 80) {
//     return "success";
//   }
//   if (Number(score) > 30 && Number(score) < 80) {
//     return "normal";
//   }
//   return "exception";
// };
const CandidateEvaluationReport = ({ evaluation }) => {
  const { feedback } = evaluation;
  const profileRelevancyScore = feedback["relevancy_score"];
  const feedbackReason = feedback.reason;

  //   const progressStatus = getProgressStatus(profileRelevancyScore);
  return (
    <div>
      <div className="flex items-center gap-5 mb-5">
        <p>Profile Relevancy</p>
        <Progress
          type="circle"
          percent={profileRelevancyScore}
          size={"small"}
          status={"normal"}
        />
      </div>
      <p>{feedbackReason}</p>
    </div>
  );
};

export default CandidateEvaluationReport;
