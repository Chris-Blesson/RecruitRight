"use client";
import { useAccountsContext } from "@/app/components/AccountsContext";
import { Button, Form, Input, message, Space } from "antd";
import { useState } from "react";

const ReadOnlyView = ({ label, value }: { label: string; value: string }) => {
  return (
    <div>
      <p>{label}</p>
      <p>{value}</p>
    </div>
  );
};
const BasicInformation = () => {
  const { accountDetails, accountContextLoading, updateAccountDetails } =
    useAccountsContext();
  const [readOnlyMode, setReadOnlyMode] = useState(true);
  const [form] = Form.useForm();

  //TODO: Remove this Basics
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
        <h3>Basic Information</h3>
        {readOnlyMode && (
          <Button
            type="text"
            onClick={() => {
              setReadOnlyMode(!readOnlyMode);
            }}
          >
            Edit
          </Button>
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
    </div>
  );
};

export default BasicInformation;
