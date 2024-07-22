"use client";

import { Button, message, Modal } from "antd";
import { useEffect, useState } from "react";

const ReachOutUi = ({
  submissionId,
  candidateId,
  onSuccess,
  openModal,
  onClose,
}) => {
  const [reachOutConfirmationModalOpen, setReachOutConfirmationModalOpen] =
    useState(openModal);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (openModal) {
      setReachOutConfirmationModalOpen(true);
    } else {
      setReachOutConfirmationModalOpen(false);
    }
  }, [openModal]);

  const onOk = () => {
    setIsLoading(true);
    fetch(
      `/api/accounts/${candidateId}/recruiter-view?submission_id=${submissionId}`
    )
      .then((res) => {
        return res.json();
      })
      .then((response) => {
        if (response?.message === "Not enough credits") {
          message.error("Not enough credits");
        } else {
          onSuccess({ ...response });
        }
      })
      .catch((err) => {
        console.log("error", err);
        setIsLoading(false);
        message.error(err);
        onClose?.();
      })
      .finally(() => {
        setIsLoading(false);
        setReachOutConfirmationModalOpen(false);
        onClose?.();
      });
  };
  const onCancel = () => {
    setReachOutConfirmationModalOpen(false);
    onClose?.();
  };
  return (
    <div>
      <Modal
        open={reachOutConfirmationModalOpen}
        onOk={onOk}
        onCancel={onCancel}
        closable={false}
        closeIcon={<></>}
        footer={<></>}
      >
        <h2>This will reduce 1 credit points. Are you sure?</h2>
        <div className="flex justify-end items-center gap-3">
          <Button
            type="dashed"
            onClick={() => {
              onCancel();
            }}
            loading={isLoading}
            disabled={isLoading}
          >
            Close
          </Button>
          <Button
            type="primary"
            onClick={() => {
              onOk();
            }}
            loading={isLoading}
            disabled={isLoading}
          >
            Ok
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default ReachOutUi;
