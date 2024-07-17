import { knex } from "@/lib/db";

export const fetchJobById = async ({ jobId }: { jobId: string }) => {
  console.log("Fetch job by id", jobId);
  try {
    return await knex("job")
      .where({
        job_id: jobId,
      })
      .first();
  } catch (error) {
    throw error;
  }
};
