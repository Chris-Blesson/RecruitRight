import { ACCOUNT_TYPE } from "@/constants/accountTypes";
import { knex } from "@/lib/db";
import { entityIdGenerator } from "@/lib/entityIdGenerator";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const requestBody = await req.json();
  if (!requestBody) {
    return NextResponse.json(
      {
        message: "Invalid request",
      },
      {
        status: 400,
      }
    );
  }
  const accountId = entityIdGenerator("account");
  //TODO: get email from authentication
  const email = "lp@lp.com";
  const { name, type, organisation } = requestBody;
  if (!type) {
    return NextResponse.json(
      {
        message: "Missing required parameter-type",
      },
      {
        status: 400,
      }
    );
  }
  if (type === ACCOUNT_TYPE.RECRUITER && (!organisation || !name || !email)) {
    return NextResponse.json(
      {
        message: "Organisation|name|email is missing for type recruiter",
      },
      {
        status: 400,
      }
    );
  }
  try {
    const accountDetails = await knex("accounts").where("email", email).first();
    const isAccountExistAlready = !!accountDetails;
    if (isAccountExistAlready) {
      return NextResponse.json(
        {
          message: "Account already exists",
        },
        {
          status: 400,
        }
      );
    }
    const createAccountPayload = await knex("accounts")
      .insert({
        account_id: accountId,
        email,
        name,
        type,
      })
      .returning("*");
    return NextResponse.json({
      ...createAccountPayload[0],
    });
  } catch (err) {
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
