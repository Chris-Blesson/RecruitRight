import { Tabs, TabsProps } from "antd";
import { useMemo } from "react";

const BasicInfo = ({ fieldName, fieldValue }) => {
  return (
    <div className="flex items-center gap-x-3 text-gray-300">
      <h2 className="font-normal">{fieldName}:</h2>
      <h3 className="font-medium capitalize">{fieldValue}</h3>
    </div>
  );
};

const JobAndCompanyInfo = ({ jobDescription, companyDescription }) => {
  return (
    <section className="flex flex-col gap-y-6">
      <div className="flex flex-col gap-y-3">
        <h1 className="text-2xl font-bold">Job Description</h1>
        <p className="text-gray-300">{jobDescription}</p>
      </div>
      <div className="flex flex-col gap-y-3">
        <h1 className="text-2xl font-bold">Culture of the company</h1>
        <p className="text-gray-300">{companyDescription}</p>
      </div>
    </section>
  );
};

const DetailsPane = ({
  jobId,
  companyName,
  jobDescription,
  companyDescription,
  role,
  offerType,
  location,
  compensationCurrency,
  compensationAmount,
}) => {
  const items: TabsProps["items"] = useMemo(() => {
    return [
      {
        key: "1",
        label: "Job and Company Info",
        children: (
          <JobAndCompanyInfo
            jobDescription={jobDescription}
            companyDescription={companyDescription}
          />
        ),
      },
      {
        key: "2",
        label: "Applied Candidates",
        children: <>Test 2</>,
      },
    ];
  }, []);
  return (
    <div className="bg-white flex-1 rounded-lg p-6 font-medium flex flex-col gap-y-3 h-full">
      <h1 className="text-2xl font-bold">Contest Details</h1>
      <div className="job-details flex flex-col gap-y-4 overflow-auto">
        <BasicInfo fieldName={"Company Name"} fieldValue={companyName} />
        <BasicInfo fieldName={"Location"} fieldValue={location} />
        <BasicInfo
          fieldName={"Salary"}
          fieldValue={`${compensationAmount} ${compensationCurrency} `}
        />
        <BasicInfo fieldName={"Role"} fieldValue={role} />
        <BasicInfo fieldName={"Type"} fieldValue={offerType} />

        <Tabs defaultActiveKey="1" items={items} />
      </div>
    </div>
  );
};

export default DetailsPane;
