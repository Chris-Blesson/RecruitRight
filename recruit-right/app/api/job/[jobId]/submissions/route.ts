import { knex } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { jobId: string } }
) {
  const { jobId } = params;
  try {
    const submissionInfo = await knex("submissions").where({ job_id: jobId });
    return NextResponse.json(submissionInfo);
  } catch (err) {
    const error = JSON.stringify(err);
    return NextResponse.json({
      error,
    });
  }
}
