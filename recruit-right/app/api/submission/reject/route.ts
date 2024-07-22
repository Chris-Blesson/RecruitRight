import { SUBMISSION_STATUS } from "@/constants/submissionStatus";
import { knex } from "@/lib/db";
import { getAccountDetails } from "@/lib/getAccountDetails";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  const accountDetails = await getAccountDetails();
  if (!accountDetails) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      {
        status: 403,
      }
    );
  }
  const { submissionId } = await req.json();
  try {
    await knex("submissions")
      .where({
        submission_id: submissionId,
      })
      .update({
        status: SUBMISSION_STATUS.REJECTED,
      });
    return NextResponse.json({
      message: "Updated Successfully",
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
