import { ACCOUNT_TYPE } from "@/constants/accountTypes";
import { knex } from "@/lib/db";
import { getAccountDetails } from "@/lib/getAccountDetails";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  const url = new URL(req.nextUrl);
  const submissionId = url.searchParams.get("submission_id");
  const accountDetails = await getAccountDetails();
  console.log("account details", accountDetails);
  const isRecruiter = accountDetails?.type === ACCOUNT_TYPE.RECRUITER;
  if (!isRecruiter || !accountDetails) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      {
        status: 403,
      }
    );
  }
  try {
    const submissionDetails = await knex("submissions")
      .where({
        submission_id: submissionId,
      })
      .first();
    if (!submissionDetails) {
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
      ...submissionDetails,
    });
  } catch (err) {
    console.log("err", err);
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
