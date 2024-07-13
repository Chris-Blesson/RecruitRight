"use client";
import { useAccountsContext } from "@/app/components/AccountsContext";
import { Button, Modal } from "antd";
import { useState } from "react";

const Resume = () => {
  const { accountDetails, accountContextLoading, updateAccountDetails } =
    useAccountsContext();
  const [viewResumeModalOpen, setViewResumeModalOpen] = useState(false);
  if (!accountDetails) {
    return <p>Not available yet</p>;
  }
  const resumeUrl = accountDetails?.resume_url;
  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          setViewResumeModalOpen(true);
        }}
      >
        View My Resume
      </Button>

      {/**TODO: Update resume */}
      <Button>Update resume</Button>
      <Modal
        open={viewResumeModalOpen}
        width={700}
        height={500}
        closeIcon={null}
        footer={null}
      >
        <object data={resumeUrl} width={"100%"} height={"500px"}></object>
        <div className="w-full flex justify-end mt-5">
          <Button
            type="primary"
            onClick={() => {
              setViewResumeModalOpen(false);
            }}
          >
            Close
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Resume;
