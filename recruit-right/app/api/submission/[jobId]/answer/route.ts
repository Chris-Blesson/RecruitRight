import { SUBMISSION_STATUS } from "@/constants/submissionStatus";
import knex from "knex";
import { NextResponse } from "next/server";

export const GET = async (req, { params }: { params: { jobId: string } }) => {
  const job = await knex("jobs").where("job_id", params.jobId).first();

  if (!job) {
    return NextResponse.json(
      {
        message: "Job is not valid",
      },
      {
        status: 400,
      }
    );
  }

  //TODO: Get the account id from auth
  const accountId = "1";
  const submissionDetails = await knex("submissions")
    .where({
      account_id: accountId,
      job_id: params.jobId,
      status: SUBMISSION_STATUS.IN_PROGRESS,
    })
    .first();
  if (!submissionDetails) {
    return NextResponse.json(
      {
        message: "Submission details not available",
      },
      {
        status: 400,
      }
    );
  }
  const answers = submissionDetails.test_response;
  return NextResponse.json(
    {
      answers,
    },
    {
      status: 200,
    }
  );
};
