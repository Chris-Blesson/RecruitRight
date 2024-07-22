"use client";

import { Button, message, Modal, Tooltip } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { SUBMISSION_STATUS } from "@/constants/submissionStatus";
import ReachOutUi from "./ReachOutUi";
import { useEffect, useState } from "react";

const CandidateDetails = ({ submissionId, currentCandidate }) => {
  const [isReachOutUiOpen, setIsReachOutUiOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCandidateDetails, setCurrentCandidateDetails] = useState({});
  const [CandidateResumeModalOpen, setCandidateResumeModalOpen] =
    useState(false);

  const fetchSubmissionInfo = () => {
    setIsLoading(true);
    fetch(`/api/submission?submission_id=${submissionId}`)
      .then((res) => {
        return res.json();
      })
      .then((response) => {
        const isSubmissionSubmitted =
          response?.status === SUBMISSION_STATUS.SUBMITTED;
        if (isSubmissionSubmitted) {
          setIsReachOutUiOpen(true);
        } else {
          setCandidateResumeModalOpen(true);
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
    setCandidateResumeModalOpen(true);
  };

  const onClose = () => {
    setIsReachOutUiOpen(false);
  };

  const fetchCandidate = () => {
    setIsLoading(true);
    fetch(`/api/accounts/details/${currentCandidate}`)
      .then((res) => {
        return res.json();
      })
      .then((response) => {
        console.log("response", response);
        setCurrentCandidateDetails({ ...response });
      })
      .catch((err) => {
        message.error("Something went wrong");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  useEffect(() => {
    if (CandidateResumeModalOpen) {
      fetchCandidate();
    }
  }, [CandidateResumeModalOpen]);

  console.log("current candidate details", currentCandidateDetails);
  return (
    <>
      <Tooltip title="View Candidate details">
        <Button
          onClick={(e) => {
            fetchSubmissionInfo();
          }}
          loading={isLoading}
          disabled={isLoading}
        >
          <UserOutlined />
        </Button>
      </Tooltip>
      <ReachOutUi
        candidateId={currentCandidate}
        submissionId={submissionId}
        onSuccess={onReachOutSuccess}
        openModal={isReachOutUiOpen}
        onClose={onClose}
      />
      <Modal
        open={CandidateResumeModalOpen}
        closable={false}
        onOk={() => {
          setCandidateResumeModalOpen(false);
        }}
        onCancel={() => {
          setCandidateResumeModalOpen(false);
        }}
        loading={isLoading}
        cancelText=""
        cancelButtonProps={{
          style: {
            display: "none",
          },
        }}
      >
        <object
          type="application/pdf"
          //@ts-ignore
          data={currentCandidateDetails?.resume_url}
          width="100%"
          height="600"
        ></object>
      </Modal>
    </>
  );
};

export default CandidateDetails;
