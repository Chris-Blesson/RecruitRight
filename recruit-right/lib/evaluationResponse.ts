import { SUBMISSION_STATUS } from "@/constants/submissionStatus";
import { knex } from "./db";

export const evaluationResponse = async ({
  accountId,
  testResponse,
  jobId,
  processId,
}) => {
  const trxProvider = knex.transactionProvider();
  const trx = await trxProvider();
  try {
    //TODO:Evaluate the response

    console.log("evaluate response");
    //Update the evaluation in the submission table
    const updatePayload = {
      status: SUBMISSION_STATUS.COMPLETED,
      evaluation: JSON.stringify({
        feedback: "Overeall good",
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
