"use client";
import { useAccountsContext } from "@/app/components/AccountsContext";
import ResumeUploader from "@/app/components/ResumeUpload";
import { Button, Modal } from "antd";
import { useState } from "react";

const Resume = () => {
  const { accountDetails } = useAccountsContext();
  const [updateResumeModalOpen, setupdateResumeModalOpen] = useState(false);
  if (!accountDetails) {
    return <p>Not available yet</p>;
  }
  const resumeUrl = accountDetails?.resume_url;
  return (
    <div>
      <div className="w-full flex justify-end mb-3">
        <Button
          onClick={() => {
            setupdateResumeModalOpen(true);
          }}
        >
          Update resume
        </Button>
      </div>

      <object data={resumeUrl || ""} width={"100%"} height={"700px"}></object>

      <Modal
        open={updateResumeModalOpen}
        width={700}
        height={500}
        closeIcon={null}
        footer={null}
      >
        <ResumeUploader
          withCreateAccount={false}
          onSuccess={() => {
            setupdateResumeModalOpen(false);
            return null;
          }}
        />
      </Modal>
    </div>
  );
};

export default Resume;
