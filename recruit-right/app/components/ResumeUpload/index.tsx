"use client";
import { RcFile, UploadProps } from "antd/es/upload";
import { useState } from "react";
import FileUpload from "../FileUpload";
import { Button, GetProp, message } from "antd";
import { useRouter } from "next/navigation";
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const ResumeUploader = () => {
  const [uploadedResume, setUploadedResume] = useState<RcFile>();
  const [loading, setLoading] = useState(false);
  const [isResumeUploaded, setIsResumeUploaded] = useState(false);
  const router = useRouter();
  const handleFileUpload = (file?: RcFile) => {
    setUploadedResume(file);
  };

  const startYourJourneyClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    const formData = new FormData();
    formData.append("file", uploadedResume as FileType);
    setLoading(true);
    fetch("/api/resume/upload", {
      method: "POST",
      body: formData,
    })
      .then(() => {
        message.success("Resume is safe with us!");
        setIsResumeUploaded(true);
        setTimeout(() => {
          router.push("/jobs");
        }, 1000);
      })
      .catch((err) => {
        message.error("Something went wrong while uploading the resume");
        console.log("error", err);
      })
      .finally(() => {
        setLoading(false);
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
            disabled={!uploadedResume || loading || isResumeUploaded}
            loading={loading || isResumeUploaded}
          >
            {!isResumeUploaded
              ? "Start Your Journey!"
              : "Starting your journey..."}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResumeUploader;
