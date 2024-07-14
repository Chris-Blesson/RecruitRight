import { entityIdGenerator } from "@/lib/entityIdGenerator";
import { NextResponse } from "next/server";
import { knex } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    // Generate template Id
    const jobId = entityIdGenerator("job");
    //Insert the process to table
    await knex("job").insert({
      job_id: jobId,
      ...payload,
    });
    return NextResponse.json({ jobId, ...payload });
  } catch (e) {
    const error = JSON.stringify(e);
    return NextResponse.json({
      error,
    });
  }
}
