import { knex } from "../db";

export const CreateJobTable = async () => {
  await knex.raw(`CREATE TABLE public.job (
	job_id varchar NOT NULL,
	company_name varchar NOT NULL,
	company_description varchar NULL,
	job_description varchar NOT NULL,
	"role" varchar NOT NULL,
	offer_type varchar NOT NULL,
	start_date_time timestamp NOT NULL,
	end_date_time timestamp NOT NULL,
	is_published boolean NOT NULL DEFAULT false,
	status varchar NOT NULL,
	contract_duration varchar NULL,
	compensation_amount varchar NOT NULL,
	compensation_currency varchar NOT NULL,
	"location" varchar NOT NULL,
	org_id varchar NOT NULL,
	questions json NOT NULL,
	CONSTRAINT job_pk PRIMARY KEY (job_id)
);
`);
};
