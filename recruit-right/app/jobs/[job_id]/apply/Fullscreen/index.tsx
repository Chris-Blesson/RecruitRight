"use client";
import { useAccountsContext } from "@/app/components/AccountsContext";
import { Button, Modal } from "antd";
import { useEffect, useState } from "react";

const FullScreenChecker = () => {
  const [isFullScreenRequestModalOpen, setIsFullScreenRequestModalOpen] =
    useState(false);
  const { changeSidebarView } = useAccountsContext();
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
    changeSidebarView({ open: false });
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
      styles={{
        mask: {
          backdropFilter: "blur(8px)",
        },
      }}
    >
      <h2 className="flex flex-col gap-1 text-lg mb-2 font-bold">
        Fullscreen mode
      </h2>
      <p className="mb-3">
        <p>Please enable fullscreen to continue the contest</p>
      </p>
      <div>
        <Button
          type="primary"
          onClick={(e) => {
            requestFullscreenAccess(e);
            setIsFullScreenRequestModalOpen(false);
          }}
          className="w-full"
        >
          Enable
        </Button>
      </div>
    </Modal>
  );
};

export default FullScreenChecker;
