import { fetchJobListing } from "@/lib/fetchJobListing";
import { notFound } from "next/navigation";
import JobListingTable from "./JobListingTable";
import HeaderSetter from "../components/HeaderSetter";

const Jobs = async () => {
  try {
    const jobs = await fetchJobListing();
    if (!jobs || !jobs.length) {
      return <p>No jobs found</p>;
    }
    return (
      <>
        <div>
          <HeaderSetter text={"Jobs"} />
        </div>
        <JobListingTable jobListing={jobs} />
      </>
    );
  } catch (err) {
    console.log("jobs error", err);
    return notFound();
  }
};

export default Jobs;
