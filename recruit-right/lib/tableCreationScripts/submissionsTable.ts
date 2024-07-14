import { knex } from "../db";

export const CreateSubmissionsTable = async () => {
  await knex.raw(`CREATE TABLE public.submissions (
        submission_id varchar(128) PRIMARY KEY NOT NULL,
        account_id varchar(128) NOT NULL,
        job_id varchar(128) NOT NULL,
        evaluation json,
        test_response json,
        started_at TIMESTAMP NOT NULL,
        score varchar(128) NOT NULL,
        status varchar(128) NOT NULL,
        ended_at TIMESTAMP
    );`);
  await knex.raw(
    "CREATE INDEX submissions_account_id_idx ON public.submissions (account_id,job_id);"
  );
};
