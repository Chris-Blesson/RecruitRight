import { ACCOUNT_TYPE } from "@/constants/accountTypes";
import { SUBMISSION_STATUS } from "@/constants/submissionStatus";
import { knex } from "@/lib/db";
import { message } from "antd";
import { NextResponse } from "next/server";

//This api is only accessible for recruiters
export const GET = async (req, { params }: { params: { id: string } }) => {
  try {
    const candidateAccount = params.id;

    //Get the recruiter account id from auth
    const recruiterAccountId = "2";
    const submissionId = req.nextUrl.searchParams.get("submission_id");
    if (!submissionId) {
      return NextResponse.json(
        {
          message: "Submission ID is missing from query",
        },
        {
          status: 400,
        }
      );
    }
    const recruiterAccountDetails = await knex("accounts")
      .where({
        account_id: recruiterAccountId,
      })
      .select("type")
      .first();

    const isRecruiterAccountARecruiter =
      recruiterAccountDetails.type === ACCOUNT_TYPE.RECRUITER;
    if (!isRecruiterAccountARecruiter) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 403,
        }
      );
    }

    //Fetch the recruiter credit details
    const recruiterCreditDetails = await knex("credits")
      .where({
        account_id: recruiterAccountId,
        type: ACCOUNT_TYPE.RECRUITER,
      })
      .select("credits_available")
      .first();

    if (!recruiterCreditDetails) {
      return NextResponse.json(
        {
          message: "Credit details not found",
        },
        {
          status: 404,
        }
      );
    }

    //Get the recruiter credits
    const recruiterCredits = recruiterCreditDetails["credits_available"];

    //Is credits available for the recruiter?
    const isCreditsAvailable = Number(recruiterCredits) > 0;
    if (!isCreditsAvailable) {
      return NextResponse.json(
        {
          message: "Not enough credits",
        },
        {
          status: 400,
        }
      );
    }

    //Fetch the candidate resume details
    const candidateDetails = await knex("accounts")
      .where({
        account_id: candidateAccount,
      })
      .select("resume_payload")
      .first();

    if (!candidateDetails) {
      return NextResponse.json(
        {
          message: "Candidate details not found",
        },
        {
          status: 404,
        }
      );
    }

    const trxProvider = knex.transactionProvider();
    const trx = await trxProvider();
    try {
      const submissionDetails = await knex("submissions")
        .where({
          submission_id: submissionId,
          status: SUBMISSION_STATUS.SUBMITTED,
        })
        .first();
      if (!submissionDetails) {
        return NextResponse.json(
          {
            message: "Invalid submission ID",
          },
          {
            status: 400,
          }
        );
      }
      await knex("credits")
        .where({
          account_id: recruiterAccountId,
        })
        .update({
          credits_available: recruiterCreditDetails["credits_available"] - 1,
        });

      //Update the submission id torecruiter viewed
      await knex("submissions")
        .where({
          submission_id: submissionId,
        })
        .update({
          status: SUBMISSION_STATUS.HIRING_MANAGER_VIEWED,
        });
      trx.commit();
    } catch (err) {
      trx.rollback();
      throw err;
    }

    return NextResponse.json({
      ...candidateDetails?.resume_payload,
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
};
