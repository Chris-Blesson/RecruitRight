"use client";
import { Table } from "antd";
import { useEffect, useState } from "react";

const COLUMNS = [
  {
    title: "Job Link",
    dataIndex: "objectId",
    key: "objectId",
    render: (_, data) => {
      return (
        <a href={`http://localhost:3000/jobs/${data.objectID}`} target="_blank">
          View Job
        </a>
      );
    },
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "role",
  },
  {
    title: "Company",
    dataIndex: "companyName",
    key: "companyName",
  },
  {
    title: "About the company",
    dataIndex: "companyDescription",
    key: "companyDescription",
  },
];
const SimilarJobsRecommendation = ({ jobId }) => {
  const [similarJobs, setSimilarJobs] = useState();

  useEffect(() => {
    fetch("http://localhost:3000/api/algolia/recommend-jobs/1572936000").then(
      async (response) => {
        const data = await response.json();
        setSimilarJobs(data);
      }
    );
  }, []);

  //   Hardcoding job Id for now since the job is yet to be trained

  return (
    //@ts-ignore
    <Table columns={COLUMNS} dataSource={similarJobs?.results?.[0]?.hits} />
  );
};

export default SimilarJobsRecommendation;
