import { PROCESS_TYPE } from "@/constants/processTypes";
import { RESUME_PARSER_STATUS } from "@/constants/resumeParserStatus";
import { knex } from "@/lib/db";
import { getAccountDetails } from "@/lib/getAccountDetails";
import { NextResponse } from "next/server";

export async function GET() {
  //TODO: Get the acc id once auth is implemented
  //Fetch the resume progress based on the acc id
  const accountDetails = await getAccountDetails();
  const account_id = accountDetails.account_id;

  //fetch the inprogress process of type resume_parse
  const process = await knex("process")
    .where("account_id", account_id)
    .andWhere("process_type", PROCESS_TYPE.RESUME_PARSE)
    .andWhere("status", RESUME_PARSER_STATUS.IN_PROGRESS)
    .select("process_id")
    .first();
  console.log("[parse-progress]", process);
  if (process) {
    return NextResponse.json({
      message: RESUME_PARSER_STATUS.IN_PROGRESS,
    });
  }
  return NextResponse.json({
    message: RESUME_PARSER_STATUS.COMPLETED,
  });
}
