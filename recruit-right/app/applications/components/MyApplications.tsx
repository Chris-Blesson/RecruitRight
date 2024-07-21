"use client";

import { SUBMISSION_STATUS_TAG_MAPPING } from "@/constants/submissionStatus";
import { Table, Tag } from "antd";
import { useEffect, useState } from "react";

const COLUMNS = [
  {
    title: "Company",
    dataIndex: "company_name",
    key: "company_name",
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "role",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (_, data) => {
      return (
        <>
          <Tag
            color={SUBMISSION_STATUS_TAG_MAPPING?.[data?.status]}
            key={data?.status}
          >
            {data?.status}
          </Tag>
        </>
      );
    },
  },
];

const MyApplications = ({ accountId }) => {
  const [myApplications, setMyApplications] = useState([]);
  useEffect(() => {
    fetch(`/api/accounts/${accountId}/my-submissions`).then(async (data) => {
      const applications = await data.json();
      console.log("Applications", applications);
      setMyApplications(applications);
    });
  }, [accountId]);

  return (
    <div>
      <Table dataSource={myApplications} columns={COLUMNS} />
    </div>
  );
};

export default MyApplications;
