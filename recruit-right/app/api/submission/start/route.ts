import { SUBMISSION_STATUS } from "@/constants/submissionStatus";
import { knex } from "@/lib/db";
import { entityIdGenerator } from "@/lib/entityIdGenerator";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  const reqBody = await req.json();
  const jobId = reqBody?.jobId;
  if (!jobId) {
    return NextResponse.json(
      {
        message: "Job ID is missing",
      },
      {
        status: 400,
      }
    );
  }
  const trxProvider = knex.transactionProvider();
  const trx = await trxProvider();

  try {
    //TODO: Get the accid from auth
    const accountId = "1";
    const job = await knex("jobs").where("job_id", jobId).first();
    const isJobAvailable = !!job;
    if (!isJobAvailable) {
      return NextResponse.json(
        {
          message: "Invalid Job ID",
        },
        {
          status: 400,
        }
      );
    }

    //Check if test is already in progress for the job id and the account id;
    const submissionRecord = await knex("submissions")
      .where({
        job_id: jobId,
      })
      .andWhere({
        account_id: accountId,
      })
      .andWhere({
        status: SUBMISSION_STATUS.IN_PROGRESS,
      })
      .select("submission_id")
      .first();

    const isTestInProgress = !!submissionRecord;
    const jobDetails = await knex("jobs")
      .where({ job_id: jobId })
      .select("questions")
      .first();
    if (isTestInProgress) {
      return NextResponse.json(
        {
          submissionId: submissionRecord["submission_id"],
          questions: jobDetails.questions,
        },
        {
          status: 200,
        }
      );
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
    return NextResponse.json(
      {
        submissionId,
        questions: jobDetails.questions,
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    await trx.rollback();
    throw err;
  }
};
