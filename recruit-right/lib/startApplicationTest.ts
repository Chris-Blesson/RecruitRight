import { SUBMISSION_STATUS } from "@/constants/submissionStatus";
import { knex } from "@/lib/db";
import { entityIdGenerator } from "@/lib/entityIdGenerator";

export const startApplicationTest = async ({ jobId }) => {
  if (!jobId) {
    return undefined;
  }
  const trxProvider = knex.transactionProvider();
  const trx = await trxProvider();

  try {
    //TODO: Get the accid from auth
    const accountId = "1";
    const job = await knex("job").where("job_id", jobId).first();

    const isJobAvailable = !!job;
    if (!isJobAvailable) {
      return undefined;
    }

    //Check if test is already in progress for the job id and the account id;
    const submissionRecord = await knex("submissions")
      .where({
        job_id: jobId,
      })
      .andWhere({
        account_id: accountId,
        status: SUBMISSION_STATUS.IN_PROGRESS,
      })
      .orWhere({
        account_id: accountId,
        status: SUBMISSION_STATUS.EVALUATION_PENDING,
      })
      .orWhere({
        account_id: accountId,
        status: SUBMISSION_STATUS.COMPLETED,
      })
      .select(["submission_id", "status", "started_at", "ended_at"])
      .first();

    const jobDetails = await knex("job")
      .where({ job_id: jobId })
      .select("questions")
      .first();
    if (submissionRecord) {
      const [isTestInProgress, isTestCompleted] = [
        submissionRecord.status === SUBMISSION_STATUS.IN_PROGRESS,
        submissionRecord.status === SUBMISSION_STATUS.COMPLETED ||
          submissionRecord.status === SUBMISSION_STATUS.EVALUATION_PENDING,
      ];

      if (isTestInProgress) {
        return {
          submissionId: submissionRecord["submission_id"],
          questions: jobDetails.questions.questions,
          started_at: submissionRecord["started_at"],
          ended_at: submissionRecord["ended_at"],
          account_id: accountId,
          job_id: jobId,
          status: SUBMISSION_STATUS.IN_PROGRESS,
        };
      }
      if (isTestCompleted) {
        return {
          message: "Application already submitted",
        };
      }
    }
    const submissionId = entityIdGenerator("submission");
    const startedAt = new Date();
    const endedAt = new Date(startedAt.getTime() + 30 * 60 * 1000); // Add 30 minutes

    const createSubmissionPayload = {
      submission_id: submissionId,
      started_at: startedAt,
      ended_at: endedAt,
      account_id: accountId,
      job_id: jobId,
      status: SUBMISSION_STATUS.IN_PROGRESS,
    };

    await knex("submissions").insert({ ...createSubmissionPayload });
    await trx.commit();
    return {
      questions: jobDetails.questions.questions,
      ...createSubmissionPayload,
    };
  } catch (err) {
    await trx.rollback();
    throw err;
  }
};
