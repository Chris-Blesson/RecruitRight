import { knex } from "../db";

export const CreateCreditsTable = async () => {
  await knex.raw(`CREATE TABLE public.credits (
        account_id varchar(128) PRIMARY KEY NOT NULL,
        type varchar(128) NOT NULL,
        credits_available int NOT NULL,
        next_credits_recharge_date TIMESTAMP NOT NULL
    );`);
  await Promise.all([
    knex.raw(
      "CREATE INDEX credits_index ON public.credits (credits_available);"
    ),
  ]);
};
