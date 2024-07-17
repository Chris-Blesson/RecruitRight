import { fetchJobById } from "@/lib/fetchJobById";
import JobDetails from "./components/JobDetails";



const JobDetailsPage = async ({ params }: { params: { job_id: string } }) => {
  const jobId = params.job_id;

  try {
    const jobDetails = await fetchJobById({
      jobId,
    });
    return <JobDetails jobDetails={jobDetails} />;
  } catch (error) {}
  return <div>JobDetailsPage {jobId}</div>;
};

export default JobDetailsPage;
