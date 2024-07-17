import { knex } from "./db";

export const fetchCandidateDetailsForJob = async ({ jobId, accountId }) => {
  try {
    //Check if recruiter has credits
    const submissionDetails = await knex("submissions")
      .where({
        account_id: accountId,
        job_id: jobId,
      })
      .select(["test_response", "evaluation"])
      .first();
    if (!submissionDetails) {
      throw new Error("Submission not available");
    }
    return {
      ...submissionDetails,
    };
  } catch (err) {
    throw err;
  }
};
