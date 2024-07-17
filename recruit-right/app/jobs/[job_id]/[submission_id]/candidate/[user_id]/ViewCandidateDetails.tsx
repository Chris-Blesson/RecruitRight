"use client";

import { Button, message, Modal } from "antd";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const CandidateAccountDetails = ({ accountDetails }) => {
  console.log("account details", accountDetails);
  return <>Hello</>;
};
const ViewCandidateDetails = () => {
  //TODO: View Resume PDF
  //TODO: Add reach out feature
  const [loading, setLoading] = useState(true);
  const { job_id, submission_id, user_id } = useParams();
  const [candidateAccountDetails, setCandidateAccountDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    //The user_id is candidate id
    fetch(`/api/accounts/${user_id}/${job_id}`)
      .then((res) => {
        return res.json();
      })
      .then((response) => {
        if (response?.message === "Not found") {
          setLoading(false);
          setCandidateAccountDetails(null);
        } else {
          setCandidateAccountDetails({ ...response });
        }
        console.log("response", response);
      })
      .catch((err) => {
        console.log("error", err);
        setCandidateAccountDetails(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const activateRecruiterView = () => {
    setLoading(true);
    //The user_id is candidate id
    fetch(
      `/api/accounts/${user_id}/recruiter-view?submission_id=${submission_id}`
    )
      .then((res) => {
        return res.json();
      })
      .then((response) => {
        if (response?.message === "Not enough credits") {
          message.error("Not enough credits");
        } else {
          setCandidateAccountDetails({ ...response });
        }
        console.log("response", response);
      })
      .catch((err) => {
        console.log("error", err);
        setCandidateAccountDetails(null);
        message.error(err);
      })
      .finally(() => {
        setLoading(false);
        setIsModalOpen(false);
      });
  };
  return (
    <div className="min-w-[400px] h-[80vh] overflow-auto rounded-md">
      {!candidateAccountDetails && (
        <div className="w-full h-full backdrop-blur-md flex justify-center items-center bg-white">
          <Button
            type="primary"
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            View Candidate Details
          </Button>
        </div>
      )}
      {candidateAccountDetails && (
        <CandidateAccountDetails accountDetails={candidateAccountDetails} />
      )}
      <Modal
        open={isModalOpen}
        closable={false}
        closeIcon={<></>}
        okText="Yes"
        onOk={() => activateRecruiterView()}
        onCancel={() => {
          setIsModalOpen(false);
        }}
      >
        <p>
          Are you sure you want to view the candidate info. This will reduce 1
          credit point from your account
        </p>
      </Modal>
    </div>
  );
};

export default ViewCandidateDetails;
