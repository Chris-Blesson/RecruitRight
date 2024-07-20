//This is accessible only for job-seekers

import { PROCESS_TYPE } from "@/constants/processTypes";
import { knex } from "@/lib/db";
import { message } from "antd";
import { NextResponse } from "next/server";

export const GET = async () => {
  //TODO: Get the accId from auth
  const accountId = "1";

  //Check if the resume parsing is already in progress
  const process = await knex("process")
    .where({
      account_id: accountId,
      type: PROCESS_TYPE.RESUME_PARSE,
    })
    .select("process_id")
    .first();
  if (process) {
    return NextResponse.json(
      {
        message: "Your resume parsing is still pending",
      },
      {
        status: 400,
      }
    );
  }

  //Check if the resume is not uploaded yet
  const accountDetails = await knex("accounts")
    .where({
      account_id: accountId,
    })
    .select("resume_payload")
    .first();

  if (!accountDetails || !accountDetails?.resume_payload) {
    return NextResponse.json(
      {
        message: "Your resume details are not available yet",
      },
      {
        status: 400,
      }
    );
  }

  //TODO:Create a resume evaluation process

  return NextResponse.json({
    message:
      "Successfully submitted your resume for evaluation. Please visit after sometime",
  });
};
