import { knex } from "../db";

export const CreateAccountTable = async () => {
  await knex.raw(`CREATE TABLE public.accounts (
        account_id varchar(128) PRIMARY KEY NOT NULL,
        type varchar(128) NOT NULL,
        email varchar(128) NOT NULL,
        name varchar(128) NOT NULL,
        resume_url varchar(128),
        resume_payload json,
        organisation varchar(128),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    );`);
  await knex.raw(
    "CREATE INDEX account_id_idx ON public.accounts (account_id);"
  );
};
