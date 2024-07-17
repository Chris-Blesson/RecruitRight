import { knex } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  //TODO: Get this from authentication email
  const email = "lokprakash100@gmail.com";
  if (!email) {
    return NextResponse.json(
      {
        message: "Email is required",
      },
      {
        status: 400,
      }
    );
  }
  const accountDetails = await knex("accounts").where("email", email).first();
  if (!accountDetails) {
    return NextResponse.json(
      {
        message: "Not found",
      },
      {
        status: 400,
      }
    );
  }
  return NextResponse.json({
    ...accountDetails,
  });
}
