//This route is only for job seekers.

import { ACCOUNT_TYPE } from "@/constants/accountTypes";
import { knex } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const GET = async (req, { params }) => {
  //Id is job-seeker.
  const { id } = params;
  const user = await currentUser();
  if (!user) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      {
        status: 403,
      }
    );
  }
  const accountDetails = await knex("accounts")
    .where({
      account_id: id,
    })
    .first()
    .select("type");
  const isJobSeeker = accountDetails.type === ACCOUNT_TYPE.JOB_SEEKER;
  if (!isJobSeeker) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      {
        status: 403,
      }
    );
  }
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
