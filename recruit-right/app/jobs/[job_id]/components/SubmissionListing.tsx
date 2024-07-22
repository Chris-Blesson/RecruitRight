"use client";
import { SUBMISSION_STATUS_TAG_MAPPING } from "@/constants/submissionStatus";
import { Button, Drawer, Table, Tag, Tooltip } from "antd";
import { useEffect, useState } from "react";
import SendInviteDrawer from "./SendInviteDrawer";
import CandidateDetails from "./CandidateDetails";
import RejectCandidate from "./RejectCandidate";

const COLUMNS = [
  {
    title: "Relevancy Score",
    dataIndex: "relevancyScore",
    key: "relevancyScore",
  },
  {
    title: "Feedback",
    dataIndex: "feedback",
    key: "feedback",
    render: (_, data) => {
      return (
        <Tooltip title={data.feedback}>
          <div className="w-[200px] max-w-[200px] text-ellipsis overflow-hidden line-clamp-3">
            {data.feedback}
          </div>
        </Tooltip>
      );
    },
  },

  {
    title: "Candidate Answer",
    dataIndex: "answers",
    key: "answers",
    render: (_, data) => (
      <Button
        type="link"
        onClick={() => {
          data?.setCandidateAnswers?.(data?.answers);
        }}
      >
        View Answers
      </Button>
    ),
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
  {
    title: "Action",
    key: "operation",
    render: (
      _,
      {
        accountId,
        setCurrentCandidate,
        setCurrentSubmissionStatus,
        status,
        submissionId,
        setCurrentSubmissionId,
      }
    ) => {
      return (
        <div className="flex items-center gap-2 font-md">
          <div>
            <CandidateDetails
              submissionId={submissionId}
              currentCandidate={accountId}
            />
          </div>
          <div>
            <SendInviteDrawer
              submissionId={submissionId}
              currentCandidate={accountId}
              submissionStatus={status}
            />
          </div>
          <Tooltip title="Reject the candidate">
            <RejectCandidate submissionId={submissionId} />
          </Tooltip>
        </div>
      );
    },
  },
];

const constructTableData = ({
  submissions,
  setCandidateAnswers,
  setCurrentCandidate,
  setCurrentSubmissionStatus,
  setCurrentSubmissionId,
}) => {
  return submissions.map((record) => {
    const { account_id, evaluation, status, test_response } = record;
    return {
      accountId: account_id,
      relevancyScore: evaluation?.feedback?.relevancy_score,
      feedback: evaluation?.feedback?.reason,
      status,
      answers: test_response?.response,
      setCandidateAnswers,
      setCurrentCandidate,
      setCurrentSubmissionStatus,
      submissionId: record?.submission_id,
      setCurrentSubmissionId,
    };
  });
};

const CandidateResponse = ({ answers = {} }) => {
  const questions = answers ? Object.keys(answers) : [];
  const answer = answers ? Object.values(answers) : [];
  return (
    <section className="flex flex-col gap-y-3">
      {questions.map((question, index) => {
        return (
          <div className="flex flex-col gap-y-2" key={index}>
            <h2 className="text-md font-medium capitalize">
              {index + 1 + ". " + question}
            </h2>
            <p className="italic">{(answer as Array<string>)?.[index]}</p>
          </div>
        );
      })}
    </section>
  );
};

const SubmissionListing = ({ jobId }) => {
  const [submissions, setSubmissions] = useState();
  const [candidateAnswers, setCandidateAnswers] = useState(null);
  const [currentCandidate, setCurrentCandidate] = useState("");
  const [currentSubmissionStatus, setCurrentSubmissionStatus] = useState("");
  const [currentSubmissionId, setCurrentSubmissionId] = useState("");
  useEffect(() => {
    fetch(`/api/job/${jobId}/submissions`).then(async (data) => {
      const response = await data.json();
      setSubmissions(
        constructTableData({
          submissions: response,
          setCandidateAnswers,
          setCurrentCandidate,
          setCurrentSubmissionStatus,
          setCurrentSubmissionId,
        })
      );
    });
  }, []);

  return (
    <>
      <Table columns={COLUMNS} dataSource={submissions} />
      {/* Answers slider */}
      <Drawer
        width={500}
        title="Answers"
        onClose={() => {
          setCandidateAnswers(null);
        }}
        open={!!candidateAnswers}
      >
        <CandidateResponse answers={candidateAnswers ?? {}} />
      </Drawer>
    </>
  );
};

export default SubmissionListing;
