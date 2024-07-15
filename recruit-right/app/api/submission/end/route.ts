import { PROCESS_TYPE } from "@/constants/processTypes";
import { SUBMISSION_STATUS } from "@/constants/submissionStatus";
import { knex } from "@/lib/db";
import { entityIdGenerator } from "@/lib/entityIdGenerator";
import { evaluationResponse } from "@/lib/evaluationResponse";
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
    const job = await knex("job")
      .where("job_id", jobId)
      .first()
      .select(["role"]);
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
      .andWhere({ status: SUBMISSION_STATUS.IN_PROGRESS })
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

    const evaluationResponsePayload = {
      test_response: { response: testResponse },
      status: SUBMISSION_STATUS.EVALUATION_PENDING,
    };

    console.log("evaluation response payload", evaluationResponsePayload);
    const processId = entityIdGenerator("process");
    await knex("process").insert({
      account_id: accountId,
      process_id: processId,
      process_type: PROCESS_TYPE.RESPONSE_EVALUATION,
    });
    await knex("submissions")
      .where({ job_id: jobId })
      .andWhere({ account_id: accountId })
      .andWhere({ status: SUBMISSION_STATUS.IN_PROGRESS })
      .update(evaluationResponsePayload);

    //Async call for the evaluation
    evaluationResponse({
      accountId,
      jobId,
      role: job.role,
      processId,
      testResponse,
    });
    await trx.commit();
    return NextResponse.json(
      {
        message: "Test submitted",
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
