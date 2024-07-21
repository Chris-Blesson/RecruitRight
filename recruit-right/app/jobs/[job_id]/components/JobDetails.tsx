import DetailsPane from "./DetailsPane";
import EditJobDetailsPane from "./EditJobDetailsPane";

const JobDetails = ({ jobDetails }) => {
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
  } = jobDetails;
  return (
    <div className="flex gap-x-4 items-center h-[90vh]">
      <DetailsPane
        jobId={jobDetails.job_id}
        companyName={company_name}
        companyDescription={company_description}
        role={role}
        offerType={offer_type}
        location={location}
        compensationCurrency={compensation_currency}
        compensationAmount={compensation_amount}
        jobDescription={job_description}
      />
      <EditJobDetailsPane
        jobId={job_id}
        compensationCurrency={compensation_currency}
        compensationAmount={compensation_amount}
        location={location}
      />
    </div>
  );
};

export default JobDetails;
