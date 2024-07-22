"use client";

import { Button, message } from "antd";
import { useState } from "react";
import { CloseCircleOutlined } from "@ant-design/icons";

const RejectCandidate = ({ submissionId }) => {
  const [isLoading, setIsLoading] = useState(false);

  const rejectCandidate = () => {
    setIsLoading(true);
    fetch(`/api/submission/reject`, {
      method: "POST",
      body: JSON.stringify({
        submissionId,
      }),
    })
      .then(() => {
        message.success("Rejected successfully. Please reload");
      })
      .catch(() => {
        message.error("Something went wrong");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  return (
    <div>
      <Button
        danger
        onClick={() => {
          rejectCandidate();
        }}
        loading={isLoading}
        disabled={isLoading}
      >
        <CloseCircleOutlined />
      </Button>
    </div>
  );
};

export default RejectCandidate;
