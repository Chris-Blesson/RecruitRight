"use client";

import { ACCOUNT_TYPE } from "@/constants/accountTypes";
import { Button, Result } from "antd";
import { useRouter } from "next/navigation";

const NoJobs = ({ userType = "recruiter" }) => {
  const router = useRouter();
  return (
    <>
      <Result
        status={404}
        title={
          ACCOUNT_TYPE.RECRUITER === userType
            ? "You haven't created any jobs yet"
            : "No jobs available yet!"
        }
        subTitle=""
        extra={
          userType === ACCOUNT_TYPE.RECRUITER ? (
            <Button
              type="primary"
              onClick={() => {
                router.push("/job-posting");
              }}
            >
              {userType === ACCOUNT_TYPE.RECRUITER ? "Create Job" : ""}
            </Button>
          ) : null
        }
      />
    </>
  );
};

export default NoJobs;
