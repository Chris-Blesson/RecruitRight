import { ACCOUNT_TYPE } from "@/constants/accountTypes";
import { knex } from "./db";

export const fetchCandidateDetailsForJobAndReduceCredits = async ({
  jobId,
  accountId,
  recruiterAccId,
}) => {
  try {
    //Check if recruiter has credits
    const isSubmissionAvailable = await knex("submissions")
      .where({
        account_id: accountId,
        job_id: jobId,
      })
      .select(["test_response", "evaluation"])
      .first();
    if (!isSubmissionAvailable) {
      throw new Error("Submission not available");
    }
    const accountDetails = await knex("accounts")
      .where({
        account_id: accountId,
      })
      .first();
    if (!accountDetails) {
      throw new Error("Account not available");
    }
  } catch (err) {
    throw err;
  }
};
