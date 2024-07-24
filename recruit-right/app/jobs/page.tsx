import { fetchJobListing } from "@/lib/fetchJobListing";
import { notFound } from "next/navigation";
import JobListingTable from "./JobListingTable";
import HeaderSetter from "../components/HeaderSetter";
import NoJobs from "./NoJobs";
import { getAccountDetails } from "@/lib/getAccountDetails";
import { ACCOUNT_TYPE } from "@/constants/accountTypes";
import ResumeParserProgress from "../components/ResumeParserProgress";

const Jobs = async () => {
  try {
    const jobs = await fetchJobListing();
    const accountDetails = await getAccountDetails();
    const isRecruiter = ACCOUNT_TYPE.RECRUITER === accountDetails.type;
    if (!isRecruiter) {
      return (
        <>
          <div>
            <HeaderSetter text={"Jobs"} />
          </div>
          <ResumeParserProgress />;
          {(!jobs || !jobs.length) && (
            <>
              <NoJobs userType={"job-seeker"} />
            </>
          )}
          {!!jobs && !!jobs.length && <JobListingTable jobListing={jobs} />}
        </>
      );
    }
    return (
      <>
        <div>
          <HeaderSetter text={"Jobs"} />
        </div>
        {(!jobs || !jobs.length) && (
          <>
            <NoJobs />
          </>
        )}
        {!!jobs && !!jobs.length && <JobListingTable jobListing={jobs} />}
      </>
    );
  } catch (err) {
    console.log("jobs error", err);
    return notFound();
  }
};

export default Jobs;
