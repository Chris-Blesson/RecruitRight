import { NextResponse } from "next/server";
import { knex } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const templateList = await knex("templates");
    return NextResponse.json(templateList);
  } catch (e) {
    const error = JSON.stringify(e);
    return NextResponse.json({
      error,
    });
  }
}
