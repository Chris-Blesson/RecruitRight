import { ACCOUNT_TYPE } from "@/constants/accountTypes";
import { knex } from "@/lib/db";
import { getAccountDetails } from "@/lib/getAccountDetails";
import { NextResponse } from "next/server";

export const GET = async (req, params) => {
  const accountDetails = await getAccountDetails();
  const isRecruiter = accountDetails?.type === ACCOUNT_TYPE.RECRUITER;
  if (!isRecruiter) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      {
        status: 403,
      }
    );
  }
  const accountId = params.params.id;
  try {
    const accountDetails = await knex("accounts")
      .where({ account_id: accountId })
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
    console.log("error", err);
    return NextResponse.json(
      {
        message: err,
      },
      {
        status: 500,
      }
    );
  }
};
