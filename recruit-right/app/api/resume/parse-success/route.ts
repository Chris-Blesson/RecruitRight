import { RESUME_PARSER_STATUS } from "@/constants/resumeParserStatus";
import { knex } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: any) {
  try {
    const requestBody = await req.json();
    console.log("requestBody", requestBody);
    const { processId, resumePayload, accountId } = requestBody;
    if (!processId || !resumePayload || !accountId) {
      return NextResponse.json(
        {
          message: "processId or resumePayload or accountId is missing",
        },
        {
          status: 400,
        }
      );
    }
    //If there exist an in-progress process of type resume_parse, delete it
    //Else, do no operation
    const deletedRows = await knex("process")
      .where({ process_id: processId })
      .andWhere("status", RESUME_PARSER_STATUS.IN_PROGRESS)
      .del();
    console.log("[parse success] Row deleted", deletedRows);

    if (!deletedRows) {
      return NextResponse.json(
        {
          message: "Resume not submitted yet!",
        },
        {
          status: 400,
        }
      );
    }
    //Update the accounts table with the resume payload
    const updatedAccount = await knex("accounts")
      .where("account_id", accountId)
      .update({
        resume_payload: resumePayload,
      });
    console.log("[parse success] account updated", updatedAccount);
    return NextResponse.json({
      message: "success",
    });
  } catch (err) {
    return NextResponse.json(
      {
        message: "something went wrong",
        error: err,
      },
      {
        status: 500,
      }
    );
  }
}
