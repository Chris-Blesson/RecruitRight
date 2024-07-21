//This route is only for job seekers.

import { SUBMISSION_STATUS } from "@/constants/submissionStatus";
import { knex } from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async (req, { params }) => {
  //Id is job-seeker.
  const { id } = params;

  //TODO: Implement auth
  try {
    const mySubmissions = await knex("jobsubmissionsview").where({
      account_id: id,
    });

    if (!mySubmissions) {
      return NextResponse.json(
        {
          message: "Not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(mySubmissions);
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
