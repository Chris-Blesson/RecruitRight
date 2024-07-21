"use client";
import { SUBMISSION_STATUS_TAG_MAPPING } from "@/constants/submissionStatus";
import { Button, Drawer, Dropdown, Form, Input, Table, Tag } from "antd";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { MoreOutlined, MailOutlined } from "@ant-design/icons";
import AIPrompt from "@/app/components/AIPrompt";
import { promptGenerationHandler } from "@/app/utils/promptGenerator";

type IAction = "invite" | "reject";

const handleReachOutActions = ({
  accountId,
  action,
  setCurrentCandidate,
}: {
  accountId: string;
  action: IAction; // Refer ACTIONS key
  setCurrentCandidate: Dispatch<SetStateAction<string>>;
}) => {
  console.log(action, accountId);
  if (action === "invite") setCurrentCandidate(accountId);
  //   TODO: @lok-prakash to handle for reject flow
};

// TODO: @lok-prakash to handle reach out logic
const onEmailSend = () => {};

const COLUMNS = [
  {
    title: "Candidates",
    dataIndex: "candidates",
    key: "candidates",
    render: (_, { accountId }) => (
      <Button
        type="link"
        onClick={() => {
          // TODO: @lok-prakash to wire his component
          console.log("Record", accountId);
        }}
      >
        View Candidate
      </Button>
    ),
  },
  {
    title: "Relevancy Score",
    dataIndex: "relevancyScore",
    key: "relevancyScore",
  },
  {
    title: "Feedback",
    dataIndex: "feedback",
    key: "feedback",
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
    render: (_, { accountId, setCurrentCandidate }) => (
      <Dropdown
        menu={{
          items: ACTIONS,
          onClick: (e) =>
            handleReachOutActions({
              accountId,
              action: e?.key as IAction,
              setCurrentCandidate,
            }),
        }}
      >
        <Button type="text" icon={<MoreOutlined />}></Button>
      </Dropdown>
    ),
  },
];

const ACTIONS = [
  { key: "invite", label: "Send Invite" },
  { key: "reject", label: "Reject" },
];

const constructTableData = ({
  submissions,
  setCandidateAnswers,
  setCurrentCandidate,
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
          <div className="flex flex-col gap-y-2">
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
  const [form] = Form.useForm();
  useEffect(() => {
    fetch(`/api/job/${jobId}/submissions`).then(async (data) => {
      const response = await data.json();
      setSubmissions(
        constructTableData({
          submissions: response,
          setCandidateAnswers,
          setCurrentCandidate,
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
      {/* Email invite AI template */}
      <Drawer
        width={500}
        title="Invite Candidate"
        onClose={() => {
          setCurrentCandidate("");
          form.setFieldsValue({
            email_invite: "",
          });
        }}
        open={!!currentCandidate}
      >
        <Form
          className="max-w-[750px] flex flex-col gap-y-5"
          form={form}
          name="job_posting"
          layout="vertical"
          onFinish={onEmailSend}
        >
          <Form.Item
            className="relative"
            name="email_invite"
            label={
              <div className="flex items-center justify-between gap-x-2">
                <p className="font-medium">Invite Email</p>
                <AIPrompt
                  triggerText=""
                  asyncSubmitHandler={async (content) => {
                    const emailResponse = await promptGenerationHandler({
                      content,
                    });
                    form.setFieldsValue({
                      email_invite: emailResponse?.content,
                    });
                  }}
                />
              </div>
            }
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item className="flex justify-end" shouldUpdate>
            {() => (
              <Button
                icon={<MailOutlined />}
                type="primary"
                htmlType="submit"
                disabled={
                  !!form.getFieldsError().filter(({ errors }) => errors.length)
                    .length
                }
              >
                Send Invite
              </Button>
            )}
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};

export default SubmissionListing;
