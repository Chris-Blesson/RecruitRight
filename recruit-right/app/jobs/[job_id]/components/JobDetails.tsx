import { getAccountDetails } from "@/lib/getAccountDetails";
import DetailsPane from "./DetailsPane";
import EditJobDetailsPane from "./EditJobDetailsPane";
import { ACCOUNT_TYPE } from "@/constants/accountTypes";

const JobDetails = async ({ jobDetails }) => {
  const {
    job_id,
    company_name,
    job_description,
    company_description,
    role,
    offer_type,
    location,
    compensation_currency,
    compensation_amount,
  } = jobDetails || {};
  const accountDetails = await getAccountDetails();
  const isJobSeeker = accountDetails.type === ACCOUNT_TYPE.JOB_SEEKER;

  return (
    <div className="flex gap-x-4 items-center h-[90vh]">
      <DetailsPane
        jobId={jobDetails?.job_id}
        companyName={company_name}
        companyDescription={company_description}
        role={role}
        offerType={offer_type}
        location={location}
        compensationCurrency={compensation_currency}
        compensationAmount={compensation_amount}
        jobDescription={job_description}
        accountDetails={accountDetails}
      />
      {!isJobSeeker && (
        <EditJobDetailsPane
          jobId={job_id}
          compensationCurrency={compensation_currency}
          compensationAmount={compensation_amount}
          location={location}
        />
      )}
    </div>
  );
};

export default JobDetails;
