import { REQUIRED_KEYS_IN_RESUME_PAYLOAD } from "@/constants/resumePayloadFields";
import { knex } from "@/lib/db";
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
  //destructured properties are not allowed for updation
  const { account_id, type, organisation, created_at, resume_url, ...rest } =
    requestBody;
  //TODO: Get this from authentication
  const accountId = "1";
  const accountIdInReqBody = requestBody.account_id;
  console.log("account id in route", accountId);
  console.log("update account req payload", requestBody);
  const { email, name, resume_payload } = rest;
  if (!email || !name || !resume_payload) {
    return NextResponse.json(
      {
        message: "Missing required parameters. Email, name and resume payload",
      },
      {
        status: 400,
      }
    );
  }
  const resumePayloadKeys = Object.keys(resume_payload).sort();
  for (
    let keyMatcherIdx = 0;
    keyMatcherIdx < REQUIRED_KEYS_IN_RESUME_PAYLOAD.length;
    keyMatcherIdx++
  ) {
    if (
      resumePayloadKeys[keyMatcherIdx] !==
      REQUIRED_KEYS_IN_RESUME_PAYLOAD[keyMatcherIdx]
    ) {
      return NextResponse.json(
        {
          message: `Missing required parameters - ${REQUIRED_KEYS_IN_RESUME_PAYLOAD[keyMatcherIdx]}`,
        },
        {
          status: 400,
        }
      );
    }
  }
  if (!accountIdInReqBody) {
    return NextResponse.json(
      {
        message: "Account ID not available in the body",
      },
      {
        status: 400,
      }
    );
  }
  if (accountId !== accountIdInReqBody) {
    return NextResponse.json(
      {
        message: "Forbidden",
      },
      {
        status: 403,
      }
    );
  }
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
    const updateAccountPayload = await knex("accounts")
      .where("account_id", accountId)
      .update({
        ...accountDetails,
        ...rest,
      })
      .returning("*");
    console.log("update account", JSON.stringify(updateAccountPayload));
    return NextResponse.json({
      ...updateAccountPayload[0],
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
