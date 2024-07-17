import { fetchCandidateDetailsForJob } from "@/lib/fetchCandidateDetails";
import { notFound } from "next/navigation";
import CandidateResponse from "./CandidateResponse";
import CandidateEvaluationReport from "./CandidateEvaluationReport";
import ViewCandidateDetails from "./ViewCandidateDetails";

//This page is only for HM view.
const CandidateDetailsForHiringManager = async ({ params }) => {
  console.log("HM", params);
  const { job_id, user_id } = params;
  try {
    const submissionDetails = await fetchCandidateDetailsForJob({
      accountId: user_id,
      jobId: job_id,
    });

    console.log("submission details", submissionDetails);
    return (
      <div className="flex justify-between">
        <div className="flex flex-col gap-4">
          <CandidateEvaluationReport
            evaluation={submissionDetails?.evaluation}
          />
          <div>
            <h1 className="mb-2 font-bold">Candidate Responses</h1>
            <CandidateResponse
              testResponse={submissionDetails?.test_response}
            />
          </div>
        </div>
        <div>
          <ViewCandidateDetails />
        </div>
      </div>
    );
  } catch (err) {
    return notFound();
  }
};

export default CandidateDetailsForHiringManager;
