import { SUBMISSION_STATUS } from "@/constants/submissionStatus";
import { knex } from "@/lib/db";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  const reqBody = await req.json();
  const jobId = reqBody?.jobId;
  const testResponse = reqBody?.testResponse;
  if (!jobId || !testResponse) {
    return NextResponse.json(
      {
        message: "Job ID or testResponse is missing",
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
    if (!isTestInProgress) {
      return NextResponse.json(
        {
          message: "Test is not started for this job",
        },
        {
          status: 400,
        }
      );
    }

    const autoSavePayload = {
      test_response: { response: testResponse },
    };

    console.log("autosave payload", autoSavePayload);
    await knex("submissions")
      .where({
        job_id: jobId,
        account_id: accountId,
        status: SUBMISSION_STATUS.IN_PROGRESS,
      })
      .update(autoSavePayload);
    await trx.commit();
    return NextResponse.json(
      {
        savedAt: new Date().getTime(),
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
