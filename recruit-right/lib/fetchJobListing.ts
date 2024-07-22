import moment from "moment";
import { knex } from "./db";
import { JOB_STATUS } from "@/constants/jobStatus";
import { getAccountDetails } from "./getAccountDetails";
import { ACCOUNT_TYPE } from "@/constants/accountTypes";

const getStatus = ({ currentTime, startTime, endTime }) => {
  if (startTime <= currentTime && currentTime < endTime) {
    return JOB_STATUS.HIRING;
  }
  if (currentTime < startTime) {
    return JOB_STATUS.YET_TO_HIRE;
  }
  return JOB_STATUS.COMPLETED;
};
export const fetchJobListing = async () => {
  try {
    const accountDetails = await getAccountDetails();
    const accountId = accountDetails.account_id;
    const isRecruiter = accountDetails.type === ACCOUNT_TYPE.RECRUITER;

    const jobListing = isRecruiter
      ? await knex("job")
          .select([
            "company_name",
            "job_id",
            "role",
            "location",
            "start_date_time",
            "end_date_time",
          ])
          .where({
            account_id: accountId,
          })
      : await knex("job").select([
          "company_name",
          "job_id",
          "role",
          "location",
          "start_date_time",
          "end_date_time",
        ]);
    if (!jobListing) {
      return [];
    }

    const jobListingWithStatus = jobListing.map((job) => {
      const [currentTime, startTime, endTime] = [
        moment().unix(),
        moment(job["start_date_time"]).unix(),
        moment(job["end_date_time"]).unix(),
      ];

      return {
        ...job,
        status: getStatus({
          currentTime,
          startTime,
          endTime,
        }),
      };
    });
    return jobListingWithStatus;
  } catch (err) {
    throw err;
  }
};
