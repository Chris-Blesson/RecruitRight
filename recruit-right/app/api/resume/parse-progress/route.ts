import { knex } from "@/lib/db";
import { NextResponse } from "next/server";

//Possible values
//in-progress
//completed
export async function GET() {
  //TODO: Get the acc id once auth is implemented
  //Fetch the resume progress based on the acc id
  const account_id: string = "1";

  const process = await knex("process")
    .where("account_id", account_id)
    .andWhere("process_type", "resume_parse")
    .select("process_id");

  //If a process is completed, the process record will be deleted.
  //If a process is in-progress, the process record will be available.
  console.log("process", process);
  if (process.length) {
    return NextResponse.json({
      message: "in-progress",
    });
  }
  return NextResponse.json({
    message: "completed",
  });
}
