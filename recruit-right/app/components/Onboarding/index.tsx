"use client";

import clsx from "clsx";
import Image from "next/image";
import { useState } from "react";
import ResumeUploader from "../ResumeUpload";
import { Form } from "antd";
import RecruiterFormFields from "./RecruiterFormFields";
import { useClerk } from "@clerk/nextjs";
import { PoweroffOutlined } from "@ant-design/icons";

const OnboardingForm = () => {
  const [isRecruiter, setIsRecruiter] = useState(true);
  const [form] = Form.useForm();
  const { signOut } = useClerk();
  return (
    <>
      <nav className="fixed top-0 right-0 pr-5 py-2">
        <button
          onClick={() => {
            signOut();
            window?.location?.replace("/sign-in");
          }}
        >
          <PoweroffOutlined />
        </button>
      </nav>
      <div className="flex">
        <div className="flex-1">
          <div className="relative w-full h-[100vh]">
            <Image
              src={"/onboarding.webp"}
              alt={"Recruit Right"}
              fill
              sizes="50vw"
            />
          </div>
        </div>
        <div className="flex-1 h-[100vh] flex items-center justify-center">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={() => {
                  setIsRecruiter(true);
                }}
                className={clsx(
                  isRecruiter && "text-blue-500 !border-blue-600",
                  "px-2 py-3 border border-gray-300 rounded-md"
                )}
              >
                I want to hire talent
              </button>
              <button
                onClick={() => {
                  setIsRecruiter(false);
                }}
                className={clsx(
                  !isRecruiter && "text-blue-500 !border-blue-600",
                  "px-2 py-3 border border-gray-300 rounded-md"
                )}
              >
                I want to look for jobs
              </button>
            </div>
            <div>
              {isRecruiter && <RecruiterFormFields form={form} />}
              {!isRecruiter && <ResumeUploader />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OnboardingForm;
