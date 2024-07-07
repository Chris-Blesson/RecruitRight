export const knex = require("knex")({
  client: "pg",
  version: "15.0",
  connection: "postgres://postgres:postgres@localhost:5432/recruitRight",
  searchPath: ["knex", "public"],
});
