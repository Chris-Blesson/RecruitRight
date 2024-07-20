//This route is internal webhook
import { PROCESS_TYPE } from "@/constants/processTypes";
import { knex } from "@/lib/db";
import { NextResponse } from "next/server";

//This route is not an external route
export const POST = async (req) => {
  const requestBody = await req.json();
  if (!requestBody) {
    return NextResponse.json(
      {
        message: "Bad Request",
      },
      {
        status: 400,
      }
    );
  }
  const { account_id, evaluation_payload } = requestBody;

  const trxProvider = knex.transactionProvider();
  const trx = await trxProvider();
  try {
    await knex("accounts")
      .where({
        account_id: account_id,
      })
      .update({
        resume_evaluation: evaluation_payload,
      });

    await knex("process")
      .where({
        account_id: account_id,
        process_type: PROCESS_TYPE.RESUME_EVALUATION,
      })
      .del();

    trx.commit();
    return NextResponse.json({
      message: "Success",
    });
  } catch (err) {
    trx.rollback();
    return NextResponse.json(
      {
        message: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
};
