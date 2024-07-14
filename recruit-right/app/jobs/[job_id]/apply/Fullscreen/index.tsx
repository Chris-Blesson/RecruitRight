"use client";
import { Button, Modal } from "antd";
import { useEffect, useState } from "react";

const FullScreenChecker = () => {
  const [isFullScreenRequestModalOpen, setIsFullScreenRequestModalOpen] =
    useState(false);

  const openFullScreenRequestModal = () => {
    setIsFullScreenRequestModalOpen(true);
  };
  const checkAndOpenFullScreenModal = () => {
    if (!document.fullscreenElement) {
      openFullScreenRequestModal();
    }
  };
  const fullScreenEventListener = () => {
    checkAndOpenFullScreenModal();
  };
  useEffect(() => {
    document.addEventListener("fullscreenchange", fullScreenEventListener);
    checkAndOpenFullScreenModal();
    return () =>
      document.removeEventListener("fullscreenchange", fullScreenEventListener);
  }, []);
  const requestFullscreenAccess = (e) => {
    e.stopPropagation;
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };
  return (
    <Modal
      open={isFullScreenRequestModalOpen}
      closable={false}
      closeIcon={<></>}
      footer={<></>}
    >
      <h2 className="flex flex-col gap-1">Fullscreen mode</h2>
      <p>
        <p>Please enable fullscreen to continue the contest</p>
      </p>
      <div>
        <Button
          color="primary"
          onClick={(e) => {
            requestFullscreenAccess(e);
            setIsFullScreenRequestModalOpen(false);
          }}
        >
          Enable
        </Button>
      </div>
    </Modal>
  );
};

export default FullScreenChecker;
