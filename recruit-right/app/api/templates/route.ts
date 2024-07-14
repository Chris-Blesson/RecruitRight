import { entityIdGenerator } from "@/lib/entityIdGenerator";
import { NextResponse } from "next/server";
import { knex } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const templateList = await knex("templates");
    console.log("Template list", templateList);
    return NextResponse.json(templateList);
  } catch (e) {
    const error = JSON.stringify(e);
    return NextResponse.json({
      error,
    });
  }
}
