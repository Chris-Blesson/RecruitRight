"use client";
import { Table } from "antd";
import { useEffect, useState } from "react";
const COLUMNS = [
  {
    title: "Candidate Email",
    dataIndex: "objectID",
    key: "objectID",
  },
  {
    title: "Location",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Contact No.",
    dataIndex: "phone",
    key: "phone",
  },
];
const SimilarCandidatesRecommendation = ({ candidateEmail }) => {
  const [similarCandidates, setSimilarCandidates] = useState();

  useEffect(() => {
    fetch(
      "http://localhost:3000/api/algolia/recommend-users/robert.johnson@example.com"
    ).then(async (response) => {
      const data = await response.json();
      setSimilarCandidates(data);
    });
  }, []);

  //   Hardcoding candidate email for now since the candidate is yet to be trained

  return (
    //@ts-ignore
    <Table
      scroll={{ y: 450 }}
      columns={COLUMNS}
      //@ts-ignore
      dataSource={similarCandidates?.results?.[0]?.hits}
    />
  );
};

export default SimilarCandidatesRecommendation;
