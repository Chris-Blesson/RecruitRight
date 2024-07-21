"use client";
import { RcFile, UploadProps } from "antd/es/upload";
import { useState } from "react";
import FileUpload from "../FileUpload";
import { Button, GetProp, message } from "antd";
import { useUser } from "@clerk/nextjs";
import { ACCOUNT_TYPE } from "@/constants/accountTypes";
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const ResumeUploader = () => {
  const [uploadedResume, setUploadedResume] = useState<RcFile>();
  const [loading, setLoading] = useState(false);
  const [isResumeUploaded, setIsResumeUploaded] = useState(false);
  const user = useUser();
  const handleFileUpload = (file?: RcFile) => {
    setUploadedResume(file);
  };

  const email = user?.user?.primaryEmailAddress?.emailAddress;

  const startYourJourneyClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    const requestBody = {
      type: ACCOUNT_TYPE.JOB_SEEKER,
      email: email,
    };
    const formData = new FormData();
    formData.append("file", uploadedResume as FileType);
    setLoading(true);

    fetch("/api/accounts/create", {
      method: "POST",
      body: JSON.stringify(requestBody),
    })
      .then((res) => {
        return res.json();
      })
      .then(() => {
        fetch("/api/resume/upload", {
          method: "POST",
          body: formData,
        })
          .then(() => {
            message.success("Resume is safe with us!");
            setIsResumeUploaded(true);
            window?.location?.reload();
          })
          .catch((err) => {
            message.error("Something went wrong while uploading the resume");
            console.log("error", err);
          })
          .finally(() => {
            setLoading(false);
          });
      });
  };

  return (
    <>
      <div className="mb-4">
        <FileUpload
          uploadHint="Upload your resume to start your journey"
          uploadText="Click or drag your resume to this area to upload"
          onFileUpload={handleFileUpload}
        />
      </div>
      <div className="w-full flex justify-end">
        <Button
          type="primary"
          onClick={startYourJourneyClick}
          disabled={!uploadedResume || loading || isResumeUploaded}
          loading={loading || isResumeUploaded}
        >
          {!isResumeUploaded
            ? "Start Your Journey!"
            : "Starting your journey..."}
        </Button>
      </div>
    </>
  );
};

export default ResumeUploader;
