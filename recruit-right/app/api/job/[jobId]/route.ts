import { knex } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { jobId: string } }
) {
  const { jobId } = params;
  try {
    const payload = await req.json();
    await knex("job").where({ job_id: jobId }).update(payload);
    return NextResponse.json({ jobId, ...payload });
  } catch (err) {
    const error = JSON.stringify(err);
    return NextResponse.json({
      error,
    });
  }
}
