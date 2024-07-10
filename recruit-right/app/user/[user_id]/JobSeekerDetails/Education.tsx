"use client";
import { useAccountsContext } from "@/app/components/AccountsContext";
import { Button, Collapse, Form } from "antd";
import { useEffect, useState } from "react";

const ReadOnlyViewCollapsibleContent = ({
  institution,
  area,
  studyType,
  startDate,
  endDate,
  location,
}) => {
  return (
    <>
      <div>
        <p>Institution</p>
        <p>{institution}</p>
      </div>
      <div>
        <p>Area</p>
        <p>{area}</p>
      </div>
      <div>
        <p>Study Type</p>
        <p>{studyType || "NA"}</p>
      </div>
      <div>
        <p>From</p>
        <p>{startDate || "NA"}</p>
      </div>
      <div>
        <p>Till</p>
        <p>{endDate || "NA"}</p>
      </div>
      <div>
        <p>Location</p>
        <p>{location}</p>
      </div>
    </>
  );
};
const Education = () => {
  const { accountDetails, accountContextLoading, updateAccountDetails } =
    useAccountsContext();
  const [readOnlyMode, setReadOnlyMode] = useState(true);
  const [form] = Form.useForm();

  const [educationDetails, setEducationDetails] = useState(
    accountDetails?.resume_payload?.education || []
  );

  useEffect(() => {
    setEducationDetails(accountDetails?.resume_payload?.education);
  }, [accountDetails]);
  if (!educationDetails?.length) {
    return <p>Not available yet</p>;
  }

  const initialValues = {
    ...educationDetails,
  };

  const readOnlyViewData = educationDetails.map((education, idx) => {
    const label = education.studyType
      ? `${education.studyType} - ${education.area || "NA"}`
      : education.area;
    return {
      label,
      key: idx,
      children: <ReadOnlyViewCollapsibleContent {...education} />,
    };
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3>Basic Information</h3>
        {readOnlyMode && (
          <Button
            type="text"
            onClick={() => {
              setReadOnlyMode(!readOnlyMode);
            }}
          >
            Edit
          </Button>
        )}
      </div>
      <div>
        {readOnlyMode && (
          <Collapse
            items={readOnlyViewData}
            defaultActiveKey={["0"]}
            accordion
          />
        )}
      </div>
    </div>
  );
};

export default Education;
