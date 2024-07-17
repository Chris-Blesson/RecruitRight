import { ACCOUNT_TYPE } from "@/constants/accountTypes";
import { knex } from "./db";

export const checkRecruiterCredits = async ({ recruiterAccountId }) => {
  try {
    const recruiterCreditDetails = await knex("credits")
      .where({
        account_id: recruiterAccountId,
        type: ACCOUNT_TYPE.RECRUITER,
      })
      .select("credits_available")
      .first();
    if (!recruiterCreditDetails) {
      throw new Error("Recruiter not available");
    }
    const isRecruiterHasCredits =
      Number(recruiterCreditDetails["credits_available"]) > 0;
    return isRecruiterHasCredits;
  } catch (err) {
    throw err;
  }
};
