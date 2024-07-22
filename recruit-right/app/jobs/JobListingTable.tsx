"use client";

import { Table, Tag } from "antd";
import Link from "next/link";

const JobListingTable = ({ jobListing }) => {
  const columns = [
    {
      title: "Company",
      dataIndex: "company_name",
      key: "company_name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      render: (_, { status }) => (
        <>
          <Tag>{status}</Tag>
        </>
      ),
    },
    {
      title: "View",
      key: "view",
      render: (_, record) => (
        <Link href={`/jobs/${record["job_id"]}`}>View</Link>
      ),
    },
  ];
  const dataSource = jobListing.map((job) => {
    return {
      key: job["job_id"],
      company_name: job["company_name"],
      role: job["role"],
      location: job["location"],
      status: job["status"],
      job_id: job["job_id"],
    };
  });
  return <Table dataSource={dataSource} columns={columns} />;
};

export default JobListingTable;
