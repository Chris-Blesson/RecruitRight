import { knex } from "../db";

export const CreateTemplatesTable = async () => {
  await knex.raw(`CREATE TABLE public.templates (
	template_name varchar NOT NULL,
	company_name varchar NOT NULL,
	company_description varchar NOT NULL,
	template_id varchar NOT NULL,
	CONSTRAINT templates_pk PRIMARY KEY (template_id)
);`);
};
