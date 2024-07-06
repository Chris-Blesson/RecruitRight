// Ref: https://github.com/porsager/postgres
import postgres from "postgres";

const sql = postgres(
  "postgres://postgres:postgres@localhost:5432/recruitRight"
);

export default sql;
