//This is accessible only for job-seekers

import { PROCESS_TYPE } from "@/constants/processTypes";
import { RESUME_PARSER_STATUS } from "@/constants/resumeParserStatus";
import { knex } from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async () => {
  //TODO: Get the accId from auth
  const accountId = "1";

  //Check if the resume parsing is already in progress
  const process = await knex("process")
    .where({
      account_id: accountId,
      type: PROCESS_TYPE.RESUME_EVALUATION,
      status: RESUME_PARSER_STATUS.EVALUATION_IN_PROGRESS,
    })
    .select("process_id")
    .first();
  if (process) {
    return NextResponse.json(
      {
        message: "Your resume evaluation is in progress",
      },
      {
        status: 400,
      }
    );
  }
  return NextResponse.json({
    message: "Resume evaluation is completed",
  });
};
