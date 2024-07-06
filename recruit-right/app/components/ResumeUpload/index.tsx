"use client";
import { RcFile, UploadProps } from "antd/es/upload";
import { useState } from "react";
import FileUpload from "../FileUpload";
import { Button, GetProp } from "antd";
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const ResumeUploader = () => {
  const [uploadedResume, setUploadedResume] = useState<RcFile>();

  const handleFileUpload = (file?: RcFile) => {
    setUploadedResume(file);
  };

  const startYourJourneyClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    console.log("uploaded resume", uploadedResume);
    const formData = new FormData();
    formData.append("file", uploadedResume as FileType);
    fetch("/api/resume/upload", {
      method: "POST",
      body: formData,
    });
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="">
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
            disabled={!uploadedResume}
          >
            Start Your Journey!
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResumeUploader;
