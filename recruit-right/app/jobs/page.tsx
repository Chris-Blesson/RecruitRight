import { fetchJobListing } from "@/lib/fetchJobListing";
import { notFound } from "next/navigation";
import JobListingTable from "./JobListingTable";

const Jobs = async () => {
  try {
    const jobs = await fetchJobListing();
    if (!jobs || !jobs.length) {
      return <p>No jobs found</p>;
    }
    console.log("jobs", jobs);
    return <JobListingTable jobListing={jobs} />;
  } catch (err) {
    console.log("jobs error", err);
    return notFound();
  }
};

export default Jobs;
