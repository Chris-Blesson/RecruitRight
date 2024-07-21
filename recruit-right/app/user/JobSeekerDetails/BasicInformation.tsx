"use client";
import { useAccountsContext } from "@/app/components/AccountsContext";
import { Button, Form, Input, message, Modal, Space } from "antd";
import { useState } from "react";
import { BulbOutlined } from "@ant-design/icons";
import Suggestions from "./Suggestions";
const ReadOnlyView = ({ label, value }) => {
  return (
    <div className="mb-2">
      <h2 className="text-lg font-bold">{label}</h2>
      <p className="text-base text-gray-600">{value}</p>
    </div>
  );
};

const BasicInformation = () => {
  const { accountDetails, accountContextLoading, updateAccountDetails } =
    useAccountsContext();
  const [readOnlyMode, setReadOnlyMode] = useState(true);
  const [form] = Form.useForm();
  const [isSuggestionsModalOpen, setIsSuggestionModalOpen] = useState(false);

  const basicInformation = accountDetails?.resume_payload?.basics?.Basics;
  if (!basicInformation) {
    return <p>Not available yet</p>;
  }

  const initialValues = {
    ...basicInformation,
  };
  const basicInformationData = [
    {
      label: "Name",
      value: basicInformation.name,
      name: "name",
      placeholder: "Full name",
    },
    {
      label: "Email",
      value: basicInformation.email || "NA",
      name: "email",
      placeholder: "xyz@gmail.com",
    },
    {
      label: "Phone",
      value: basicInformation.phone || "NA",
      name: "phone",
      placeholder: "+91 9000000000",
    },
    {
      label: "Website",
      value: basicInformation.website || "NA",
      name: "website",
      placeholder: "https://www.github.com",
    },
    {
      label: "Address",
      value: basicInformation.address || "NA",
      name: "address",
      placeholder: "Bangalore, India",
    },
  ];

  const handleFormSubmit = (values: {
    name: string;
    email: string;
    phone: string;
    website: string;
    address: string;
  }) => {
    const requestPayload = {
      ...accountDetails,
      resume_payload: {
        ...accountDetails["resume_payload"],
        basics: {
          Basics: {
            ...accountDetails["resume_payload"]["basics"]["Basics"],
            ...values,
          },
        },
      },
    };
    updateAccountDetails(requestPayload, {
      onSuccess() {
        message.success("Basic information updated successfully");
        setReadOnlyMode(true);
      },
      onError() {
        message.error("Something went wrong while updating basic information");
        setReadOnlyMode(false);
      },
    });
  };
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold">Basic Information</h3>
        {readOnlyMode && (
          <div className="flex items-center gap-2">
            <Button
              onClick={() => {
                setIsSuggestionModalOpen(true);
              }}
            >
              <BulbOutlined />
            </Button>
            <Button
              type="primary"
              onClick={() => {
                setReadOnlyMode(!readOnlyMode);
              }}
            >
              Edit
            </Button>
          </div>
        )}
      </div>
      <hr className="mb-4" />
      <div>
        {readOnlyMode && (
          <>
            {basicInformationData.map((basicInformationField) => {
              return (
                <ReadOnlyView
                  key={basicInformationField.label}
                  {...basicInformationField}
                />
              );
            })}
          </>
        )}
        {!readOnlyMode && (
          <>
            <Form
              layout="vertical"
              initialValues={initialValues}
              form={form}
              onFinish={(values) => {
                handleFormSubmit(values);
              }}
            >
              {basicInformationData.map((basicInformationField) => {
                return (
                  <Form.Item
                    key={basicInformationField.label}
                    name={basicInformationField.name}
                    label={basicInformationField.label}
                    rules={[{ required: true }]}
                  >
                    <Input placeholder={basicInformationField.placeholder} />
                  </Form.Item>
                );
              })}
              <Form.Item>
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    disabled={accountContextLoading}
                    loading={accountContextLoading}
                  >
                    Submit
                  </Button>
                  <Button
                    htmlType="button"
                    onClick={() => {
                      setReadOnlyMode(true);
                      form.resetFields();
                    }}
                    disabled={accountContextLoading}
                  >
                    Cancel
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </>
        )}
      </div>
      <Modal
        open={isSuggestionsModalOpen}
        closable={false}
        onOk={() => {
          setIsSuggestionModalOpen(false);
        }}
        cancelText="Done"
        onCancel={() => {
          setIsSuggestionModalOpen(false);
        }}
      >
        <Suggestions suggestions={basicInformation.improvments_suggestions} />
      </Modal>
    </div>
  );
};

export default BasicInformation;
