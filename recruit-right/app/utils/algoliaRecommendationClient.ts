const recommend = require("@algolia/recommend");

export const client = recommend(
  process.env.ALGOLIA_APP_ID,
  process.env.ALGOLIA_WRITE_API_KEY
);
