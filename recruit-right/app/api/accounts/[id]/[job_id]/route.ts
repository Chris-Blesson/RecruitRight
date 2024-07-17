//This route is only for recruiters.
//This route will fetch the candidate info for hiring manager, if the hiring manager already viewed

import { SUBMISSION_STATUS } from "@/constants/submissionStatus";
import { knex } from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async (req, { params }) => {
  //Id is job-seeker.
  const { id, job_id } = params;

  //TODO: Implement auth
  console.log("params", id, job_id);
  try {
    const submissionDetails = await knex("submissions")
      .where({
        account_id: id,
        job_id,
      })
      .whereNotIn("status", [
        SUBMISSION_STATUS.EVALUATION_PENDING,
        SUBMISSION_STATUS.IN_PROGRESS,
        SUBMISSION_STATUS.SUBMITTED,
        SUBMISSION_STATUS.REJECTED,
      ])
      .select("account_id")
      .first();
    if (!submissionDetails) {
      return NextResponse.json(
        {
          message: "Not found",
        },
        {
          status: 404,
        }
      );
    }
    const accountDetails = await knex("accounts")
      .where({
        account_id: submissionDetails.account_id,
      })
      .select("resume_payload")
      .first();
    if (!accountDetails) {
      return NextResponse.json(
        {
          message: "Not found",
        },
        {
          status: 404,
        }
      );
    }
    return NextResponse.json({
      ...accountDetails.resume_payload,
    });
  } catch (err) {
    return NextResponse.json(
      {
        message: err,
      },
      {
        status: 500,
      }
    );
  }
};
