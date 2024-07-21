"use client";
import { ACCOUNT_TYPE } from "@/constants/accountTypes";
import { Button, Form, Input, message } from "antd";
import { useState } from "react";

const RecruiterFormFields = ({ form }) => {
  const [isFormLoading, setIsFormLoading] = useState(false);
  const formSubmit = (values) => {
    setIsFormLoading(true);
    const requestBody = {
      name: values.name,
      organisation: values.organisation,
      type: ACCOUNT_TYPE.RECRUITER,
    };
    console.log("values", values);
    fetch("/api/accounts/create", {
      method: "POST",
      body: JSON.stringify(requestBody),
    })
      .then((res) => {
        return res.json();
      })
      .then(() => {
        message.success("Account created successfully");
        window?.location?.reload();
      })
      .finally(() => {
        setIsFormLoading(false);
      });
  };
  return (
    <div>
      <Form form={form} layout="vertical" onFinish={formSubmit}>
        <Form.Item label="Name" rules={[{ required: true }]} name={"name"}>
          <Input placeholder="Your name" />
        </Form.Item>
        <Form.Item
          label="Organisation"
          rules={[{ required: true }]}
          name="organisation"
        >
          <Input placeholder="Your organisation" />
        </Form.Item>
        <Form.Item className="w-full flex justify-end">
          <Button
            type="primary"
            htmlType="submit"
            disabled={isFormLoading}
            loading={isFormLoading}
          >
            Start hiring
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RecruiterFormFields;
