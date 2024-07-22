"use client";

import { Button, message, Modal, Tabs, Tooltip } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { SUBMISSION_STATUS } from "@/constants/submissionStatus";
import ReachOutUi from "./ReachOutUi";
import { useEffect, useState } from "react";
import SimilarCandidatesRecommendation from "./SimilarCandidatesRecommendation";

const CandidateDetails = ({ submissionId, currentCandidate }) => {
  const [isReachOutUiOpen, setIsReachOutUiOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCandidateDetails, setCurrentCandidateDetails] = useState({});
  const [CandidateResumeModalOpen, setCandidateResumeModalOpen] =
    useState(false);

  const tabItems = [
    {
      label: "Candidate Resume",
      key: "Resume",
      children: (
        <object
          type="application/pdf"
          //@ts-ignore
          data={currentCandidateDetails?.resume_url}
          width="100%"
          height="600"
        ></object>
      ),
    },
    {
      label: "Similar Candidates",
      key: "Similar Candidates",
      // @ts-ignore
      children: (
        <SimilarCandidatesRecommendation
          //@ts-ignore
          candidateEmail={currentCandidateDetails?.email}
        />
      ),
    },
  ];

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
        <Tabs
          // tabPosition={"left"}
          items={tabItems.map((tabItem) => {
            return {
              ...tabItem,
            };
          })}
        />
      </Modal>
    </>
  );
};

export default CandidateDetails;
