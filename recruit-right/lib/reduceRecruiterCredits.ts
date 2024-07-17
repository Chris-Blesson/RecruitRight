import { ACCOUNT_TYPE } from "@/constants/accountTypes";
import { knex } from "./db";

export const reduceRecruiterCredits = async ({ recruiterAccountId }) => {
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
    const existingCredits = recruiterCreditDetails["credits_available"];
    const newCredit = existingCredits - 1;
    await knex("credits")
      .where({
        account_id: recruiterAccountId,
        type: ACCOUNT_TYPE.RECRUITER,
      })
      .update({
        credits_available: newCredit,
      });
    return true;
  } catch (err) {
    throw err;
  }
};
