"use client";

import AIPrompt from "@/app/components/AIPrompt";
import { Button, Drawer, Form, Input, message, Tooltip } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { promptGenerationHandler } from "@/app/utils/promptGenerator";
import { SUBMISSION_STATUS } from "@/constants/submissionStatus";
import ReachOutUi from "./ReachOutUi";
import { useState } from "react";

const SendInviteDrawer = ({
  submissionId,
  currentCandidate,
  submissionStatus,
}) => {
  const [form] = Form.useForm();

  const [isReachOutUiOpen, setIsReachOutUiOpen] = useState(false);
  const [showEmailSendUi, setShowEmailSendUi] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSubmission, setCurrenSubmission] = useState({});

  const fetchSubmissionInfo = () => {
    setIsLoading(true);
    fetch(`/api/submission?submission_id=${submissionId}`)
      .then((res) => {
        return res.json();
      })
      .then((response) => {
        setCurrenSubmission(response);
        const isSubmissionSubmitted =
          response?.status === SUBMISSION_STATUS.SUBMITTED;
        if (isSubmissionSubmitted) {
          setIsReachOutUiOpen(true);
        } else {
          setShowEmailSendUi(true);
        }
      })
      .catch(() => {
        message.error("Something went wrong");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const onReachOutSuccess = () => {
    setIsReachOutUiOpen(false);
    setShowEmailSendUi(true);
  };

  const onClose = () => {
    setIsReachOutUiOpen(false);
  };

  const onEmailSend = (values) => {
    const emailInvite = values.email_invite;
    setIsLoading(true);
    fetch(`/api/accounts/${currentCandidate}/reach-out`, {
      method: "POST",
      body: JSON.stringify({
        body: emailInvite,
        submissionId,
        subject: "Congrats",
      }),
    })
      .then(() => {
        message.success("Mail sent successfully");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  if (submissionStatus === SUBMISSION_STATUS.REJECTED) {
    return null;
  }
  return (
    <>
      <Tooltip title="Send Selection Invite">
        <Button
          onClick={(e) => {
            fetchSubmissionInfo();
          }}
          loading={isLoading}
          disabled={isLoading}
        >
          <MailOutlined />
        </Button>
      </Tooltip>
      <ReachOutUi
        candidateId={currentCandidate}
        submissionId={submissionId}
        onSuccess={onReachOutSuccess}
        openModal={isReachOutUiOpen}
        onClose={onClose}
      />
      <Drawer
        width={500}
        title="Invite Candidate"
        onClose={() => {
          form.setFieldsValue({
            email_invite: "",
          });
          setShowEmailSendUi(false);
        }}
        open={showEmailSendUi}
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
                    .length || isLoading
                }
                loading={isLoading}
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

export default SendInviteDrawer;
