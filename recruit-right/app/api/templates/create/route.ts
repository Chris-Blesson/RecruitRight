import { entityIdGenerator } from "@/lib/entityIdGenerator";
import { NextResponse } from "next/server";
import { knex } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    // Generate template Id
    const templateId = entityIdGenerator("template");
    //Insert the process to table
    await knex("templates").insert({
      template_id: templateId,
      ...payload,
    });
    return NextResponse.json(payload);
  } catch (e) {
    const error = JSON.stringify(e);
    return NextResponse.json({
      error,
    });
  }
}
