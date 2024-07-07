"use client";
import { InboxOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { message, Upload } from "antd";
import { RcFile } from "antd/es/upload";
import { useEffect, useState } from "react";

const { Dragger } = Upload;

export interface IFileUpload extends UploadProps {
  onFileUpload?: (file?: RcFile) => unknown;
  uploadText: string;
  uploadHint: string;
}
const FileUpload = (props: IFileUpload) => {
  const defaultProps: UploadProps = {
    name: "file",
    multiple: false,
    maxCount: 1,
    onChange: (info) => {
      const { status } = info.file;

      if (status === "removed") {
        message.warning(`${info.file.name} file removed successfully.`);
      } else {
        message.success(`${info.file.name} file uploaded successfully.`);
      }
    },
    onDrop: (e) => {
      console.log("Dropped files", e.dataTransfer.files);
    },
    accept: ".pdf",
    hasControlInside: true,
  };

  const { onFileUpload, uploadText, uploadHint, ...rest } = props;
  const [file, setFile] = useState<RcFile>();

  useEffect(() => {
    onFileUpload?.(file);
  }, [file]);
  return (
    <Dragger
      beforeUpload={(file) => {
        setFile(file);
        return false;
      }}
      onRemove={() => {
        setFile(undefined);
      }}
      {...defaultProps}
      {...rest}
    >
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">{uploadText}</p>
      <p className="ant-upload-hint">{uploadHint}</p>
    </Dragger>
  );
};

export default FileUpload;
