"use client";

import { Button, Result } from "antd";
import { useRouter } from "next/navigation";

const NoJobs = () => {
  const router = useRouter();
  return (
    <>
      <Result
        status={404}
        title="You haven't created any jobs yet"
        subTitle=""
        extra={
          <Button
            type="primary"
            onClick={() => {
              router.push("/job-posting");
            }}
          >
            Create Job
          </Button>
        }
      />
    </>
  );
};

export default NoJobs;
