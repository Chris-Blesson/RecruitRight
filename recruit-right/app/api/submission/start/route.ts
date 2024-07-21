import { SUBMISSION_STATUS } from "@/constants/submissionStatus";
import { knex } from "@/lib/db";
import { entityIdGenerator } from "@/lib/entityIdGenerator";
import { getAccountDetails } from "@/lib/getAccountDetails";
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
    const accountDetails = await getAccountDetails();
    const accountId = accountDetails?.account_id;
    if (!accountId) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        { status: 403 }
      );
    }
    const job = await knex("job").where("job_id", jobId).first();
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
        account_id: accountId,
        status: SUBMISSION_STATUS.IN_PROGRESS,
      })
      .select("submission_id")
      .first();

    const isTestInProgress = !!submissionRecord;
    const jobDetails = await knex("job")
      .where({ job_id: jobId })
      .select("questions")
      .first();
    if (isTestInProgress) {
      return NextResponse.json(
        {
          submissionId: submissionRecord["submission_id"],
          questions: jobDetails.questions.questions,
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

    console.log("create submission payload", createSubmissionPayload);
    await knex("submissions").insert({ ...createSubmissionPayload });
    await trx.commit();
    return NextResponse.json(
      {
        submissionId,
        questions: jobDetails.questions.questions,
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
