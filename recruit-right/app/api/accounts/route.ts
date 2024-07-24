import { knex } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await currentUser();

  const loggedInEmailId = user?.primaryEmailAddress?.emailAddress;

  console.log("user", user);
  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  if (!loggedInEmailId) {
    return NextResponse.json(
      {
        message: "Email is required",
      },
      {
        status: 400,
      }
    );
  }
  const accountDetails = await knex("accounts")
    .where("email", loggedInEmailId)
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
}
