import { fetchJobListing } from "@/lib/fetchJobListing";
import { notFound } from "next/navigation";
import JobListingTable from "./JobListingTable";
import HeaderSetter from "../components/HeaderSetter";
import NoJobs from "./NoJobs";

const Jobs = async () => {
  try {
    const jobs = await fetchJobListing();

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
