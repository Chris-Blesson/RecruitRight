import { knex } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const accountId = params.id;
  console.log(">>> account id", accountId);
  try {
    const accountDetails = await knex("accounts")
      .where("account_id", accountId)
      .first();
    if (!accountDetails) {
      return NextResponse.json(
        {
          message: "Not found",
        },
        {
          status: 404,
        }
      );
    }
    return NextResponse.json({
      ...accountDetails,
    });
  } catch (err) {
    console.log("Get account error", err);
    return NextResponse.json(
      {
        message: err,
      },
      {
        status: 500,
      }
    );
  }
}
