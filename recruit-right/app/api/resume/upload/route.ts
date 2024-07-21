// Ref: https://dev.to/xhowais/nextjs-file-upload-api-documentation-3863
import { NextResponse } from "next/server";
import { entityIdGenerator } from "@/lib/entityIdGenerator";
import { RESUME_PARSER_STATUS } from "@/constants/resumeParserStatus";
import { PROCESS_TYPE } from "@/constants/processTypes";
import { knex } from "@/lib/db";
import { put, del } from "@vercel/blob";
/**
 *
 * This function is for uploading the resume
 *
 * The function checks if the upload for an acc_id is already pending
 * If the resume-parse is pending, this will return 400.
 * Else,
 * The function create and insert a process in  "process" table
 * The function also fires the third party request for resume parsing
 * The function then returns 200
 */
export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file");
  if (!file) {
    return NextResponse.json(
      { message: "No files received." },
      { status: 400 }
    );
  }

  try {
    // Write the file to the specified directory (public/assets) with the modified filename

    //TODO: Get acc id from the header
    const accountId = "1";

    //Check if there is an in-progress resume-parse job
    const inProgressJob = await knex("process")
      .where("account_id", accountId)
      .andWhere("process_type", PROCESS_TYPE.RESUME_PARSE)
      .andWhere("status", RESUME_PARSER_STATUS.IN_PROGRESS)
      .select("process_id")
      .first();

    console.log(">>In progress job", {
      accountId,
      inProgressJob,
    });

    if (inProgressJob) {
      return NextResponse.json(
        {
          message: "Resume upload already in progress",
        },
        {
          status: 400,
        }
      );
    }

    const trxProvider = knex.transactionProvider();
    const trx = await trxProvider();

    //Generate the process id
    //Create a record for the process
    //Call the resume-parser api
    try {
      //Generate the process id
      const processId = entityIdGenerator("process");

      const accountDetails = await knex("accounts")
        .where({
          account_id: accountId,
        })
        .select("resume_url")
        .first();

      if (accountDetails.resume_url) {
        await del(accountDetails.resume_url, {
          token: process.env.NEXT_BLOB_STORAGE_KEY,
        });
      }
      const data = await put(`${accountId}.pdf`, file, {
        access: "public",
        contentType: "application/pdf",
        token: process.env.NEXT_BLOB_STORAGE_KEY,
      });
      console.log(">>>File created successfully", data);

      //TODO: Update the resume url in accounts table
      await knex("accounts").where("account_id", accountId).update({
        resume_url: data.url,
      });

      //Insert the process to table
      await knex("process").insert({
        account_id: accountId,
        process_id: processId,
        status: RESUME_PARSER_STATUS.IN_PROGRESS,
        process_type: PROCESS_TYPE.RESUME_PARSE,
      });

      console.log("Process ID", processId);
      //TODO: Create parsing job fastapi
      await trx.commit();
      return NextResponse.json({ message: "Success" });
    } catch (err) {
      console.log("[RESUME_UPLOAD]Error in the transaction", err);
      await trx.rollback();
      throw err;
    }
  } catch (error) {
    console.log("[RESUME_UPLOAD]Error in the catch block", error);
    return NextResponse.json({ message: "Failed", status: 500 });
  }
}
