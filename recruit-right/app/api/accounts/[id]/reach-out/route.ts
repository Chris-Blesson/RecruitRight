import { ACCOUNT_TYPE } from "@/constants/accountTypes";
import { SUBMISSION_STATUS } from "@/constants/submissionStatus";
import { knex } from "@/lib/db";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.NEXT_RESEND_API_KEY);

export const POST = async (req, params) => {
  try {
    console.log("POST Request");

    //TODO: Get this from the auth
    const loggedInAccountId = "2";
    const requestBody = await req.json();
    console.log("request body", requestBody);
    if (!requestBody) {
      return NextResponse.json(
        {
          message: "Request body not available",
        },
        {
          status: 400,
        }
      );
    }

    const candidateId = params.params.id;
    console.log("fetch request init", candidateId);

    //Fetch candidate and the logged in account details
    const [candidateDetails, loggedInAccountDetails] = await Promise.all([
      knex("accounts")
        .where({
          account_id: candidateId,
        })
        .first(),
      knex("accounts")
        .where({
          account_id: loggedInAccountId,
        })
        .first(),
    ]);

    console.log("account details", candidateDetails, loggedInAccountDetails);

    if (!candidateDetails || !loggedInAccountDetails) {
      return NextResponse.json(
        {
          message: "Account not found",
        },
        {
          status: 404,
        }
      );
    }

    const isLoggedInAccountARecruiter =
      loggedInAccountDetails.type === ACCOUNT_TYPE.RECRUITER;
    if (!isLoggedInAccountARecruiter) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 403,
        }
      );
    }

    const toEmail = candidateDetails.email;
    const ccEmail = loggedInAccountDetails.email;

    const { body, submissionId, subject } = requestBody;

    if (!body || !submissionId || !subject) {
      return NextResponse.json(
        {
          message: "Body, submission ID, or subject is missing",
        },
        {
          status: 400,
        }
      );
    }

    const trxProvider = knex.transactionProvider();
    const trx = await trxProvider();
    try {
      const submissionDetails = await knex("submissions")
        .where({
          submission_id: submissionId,
          status: SUBMISSION_STATUS.HIRING_MANAGER_VIEWED,
        })
        .first();

      console.log("Submission details", submissionDetails);
      if (!submissionDetails) {
        return NextResponse.json(
          {
            message: "Submission not found",
          },
          {
            status: 404,
          }
        );
      }
      //Send email
      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: toEmail,
        cc: ccEmail,
        reply_to: ccEmail,
        subject: subject,
        html: body,
      });

      console.log("email sent");
      //Update the submission status
      await knex("submissions")
        .where({
          submission_id: submissionId,
        })
        .update({
          status: SUBMISSION_STATUS.HIRING_MANAGER_REACHOUT,
        });
      console.log("Submission updated");
      trx.commit();
    } catch (err) {
      console.log("error in reach out", err);
      trx.rollback();
      throw err;
    }
    return NextResponse.json({
      message: "Success",
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
