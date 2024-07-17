import { ACCOUNT_TYPE } from "@/constants/accountTypes";
import { SUBMISSION_STATUS } from "@/constants/submissionStatus";
import { knex } from "@/lib/db";
import { NextResponse } from "next/server";

//This api is allowed for hiring manager only
//Required parameter => candidate_id in query params
//job_id as a param
export const GET = async (req, { params }: { params: { jobId: string } }) => {
  const job = await knex("job").where("job_id", params.jobId).first();
  const trxProvider = knex.transactionProvider();
  const trx = await trxProvider();
  if (!job) {
    return NextResponse.json(
      {
        message: "Job is not valid",
      },
      {
        status: 400,
      }
    );
  }

  try {
    //TODO: Get the account id from auth
    const accountId = "2";

    //Fetch the logged in account details
    const accountDetails = await knex("accounts")
      .where({ account_id: accountId })
      .select("type")
      .first();

    //Check if the account is of type recruiter
    if (!accountDetails || accountDetails.type !== ACCOUNT_TYPE.RECRUITER) {
      return NextResponse.json(
        {
          message: "Invalid account",
        },
        {
          status: 400,
        }
      );
    }

    const candidateId = req.nextUrl.searchParams.get("candidate_id");
    if (!candidateId) {
      return NextResponse.json(
        {
          message: "Candidate ID not available",
        },
        {
          status: 400,
        }
      );
    }

    const submissionDetails = await knex("submissions")
      .where({
        account_id: candidateId,
        job_id: params.jobId,
        status: SUBMISSION_STATUS.SUBMITTED,
      })
      .first();

    if (!submissionDetails) {
      return NextResponse.json(
        {
          message: "Submission details not available",
        },
        {
          status: 400,
        }
      );
    }
    const answers = submissionDetails.test_response;
    const evaluation = submissionDetails.evaluation;

    trx.commit();
    return NextResponse.json(
      {
        answers,
        evaluation,
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    trx.rollback();
    throw err;
  }
};
