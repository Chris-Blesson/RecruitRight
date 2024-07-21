import { notFound } from "next/navigation";
import Footer from "./Footer";
import AnswerContextProvider from "./AnswerContext";
import Link from "next/link";
import { startApplicationTest } from "@/lib/startApplicationTest";
import FullScreenChecker from "./Fullscreen";
import ApplicationDetailsProvider from "./ApplicationDetailsContext";
import { Button } from "antd";
import ApplicationDetailsHeader from "./ApplicationDetailsHeader";
import Timer from "./Timer";
import AutoSave from "./AutoSave";
import ApplicationQuestion from "./ApplicationQuestion";
import ApplicationAnswer from "./ApplicationAnswer";
import { getAccountDetails } from "@/lib/getAccountDetails";
import { ACCOUNT_TYPE } from "@/constants/accountTypes";

//This page is accessible only for Candidates
const JobApplyPage = async ({ params }: { params: { job_id: string } }) => {
  const jobId = params.job_id;
  try {
    const accountDetails = await getAccountDetails();
    const isJobSeeker = ACCOUNT_TYPE.JOB_SEEKER === accountDetails?.type;
    if (!isJobSeeker) {
      return notFound();
    }
    const startContestDetails = await startApplicationTest({
      jobId,
    });
    const isContestAlreadyEnded =
      startContestDetails?.message === "Application already submitted";
    if (isContestAlreadyEnded) {
      return (
        <>
          <div className="w-full h-full flex flex-col gap-3 justify-center items-center">
            <p className="text-lg font-bold">
              You have completed the application already
            </p>
            <Link href={`/${jobId}/`}>
              <Button color="primary">Go to job details</Button>
            </Link>
          </div>
        </>
      );
    }
    //@ts-ignore
    const applicationDetails = startContestDetails;

    //TODO: Contest ended page

    if (!applicationDetails) {
      return null;
    }
    return (
      <>
        <section className="px-[90px] pt-[50px]">
          <FullScreenChecker />
          <ApplicationDetailsProvider applicationDetails={applicationDetails}>
            <AnswerContextProvider jobId={jobId}>
              <div className="flex justify-between w-full items-center">
                <div>
                  <ApplicationDetailsHeader />
                </div>
                <div className="flex gap-1 items-center">
                  {/*@ts-ignore*/}
                  <Timer endTime={applicationDetails?.ended_at} />
                  <AutoSave />
                </div>
              </div>
              <div className="flex mb-5 gap-8">
                <div className="flex-1">
                  <ApplicationQuestion />
                </div>
                <div className="flex-1">
                  <ApplicationAnswer />
                </div>
              </div>
              <Footer />
            </AnswerContextProvider>
          </ApplicationDetailsProvider>
        </section>
      </>
    );
  } catch (err) {
    console.log("contest details attempt page error", err);
    return notFound();
  }
};

export default JobApplyPage;
