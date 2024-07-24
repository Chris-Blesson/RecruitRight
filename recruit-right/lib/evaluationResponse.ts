import { SUBMISSION_STATUS } from "@/constants/submissionStatus";
import { knex } from "./db";
import { responseEvaluator } from "./openAi/responseEvaluator";

export const evaluationResponse = async ({
  accountId,
  testResponse,
  jobId,
  role,
  processId,
}) => {
  const trxProvider = knex.transactionProvider();
  const trx = await trxProvider();
  try {
    const modifiedTestResponse = Object.keys(testResponse).map((question) => {
      return {
        question,
        answer: testResponse[question],
      };
    });

    const accountDetailsResume = await knex("accounts")
      .where({
        account_id: accountId,
      })
      .select(["resume_payload"])
      .first();
    console.log("account details", accountDetailsResume);

    const evaluateResponse = await responseEvaluator({
      cvText: accountDetailsResume?.resume_payload,
      testRespone: modifiedTestResponse,
      role,
    });
    console.log("evaluate response", evaluateResponse);
    //Update the evaluation in the submission table
    const updatePayload = {
      status: SUBMISSION_STATUS.SUBMITTED,
      evaluation: JSON.stringify({
        //@ts-ignore
        feedback: JSON.parse(evaluateResponse),
      }),
    };
    await knex("submissions")
      .where({
        job_id: jobId,
      })
      .andWhere({
        account_id: accountId,
      })
      .andWhere({
        status: SUBMISSION_STATUS.EVALUATION_PENDING,
      })
      .update(updatePayload);

    //Delete the process in process table
    await knex("process")
      .where({
        process_id: processId,
      })
      .del();
    trx.commit();
    return;
  } catch (err) {
    trx.rollback();
    throw err;
  }
};
