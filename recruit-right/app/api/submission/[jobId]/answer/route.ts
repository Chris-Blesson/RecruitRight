import { ACCOUNT_TYPE } from "@/constants/accountTypes";
import { SUBMISSION_STATUS } from "@/constants/submissionStatus";
import { knex } from "@/lib/db";
import { getAccountDetails } from "@/lib/getAccountDetails";
import { NextResponse } from "next/server";

//This api is not allowed for hiring manager
export const GET = async (req, { params }: { params: { jobId: string } }) => {
  const job = await knex("job").where("job_id", params.jobId).first();

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

  try {
    const accountDetails = await getAccountDetails();
    const accountId = accountDetails?.account_id;
    if (!accountId || accountDetails.type === ACCOUNT_TYPE.RECRUITER) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        { status: 403 }
      );
    }

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
  } catch (err) {
    throw err;
  }
};
