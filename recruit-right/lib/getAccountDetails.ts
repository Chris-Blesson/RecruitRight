import { currentUser } from "@clerk/nextjs/server";
import { knex } from "./db";

export const getAccountDetails = async () => {
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  const accountDetails = await knex("accounts")
    .where({
      email: email,
    })
    .first();
  return accountDetails;
};
