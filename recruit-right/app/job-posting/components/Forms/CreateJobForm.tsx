"use client";
import { transformJobPostingPayload } from "@/app/utils/transforms";
import { Button, Form, Input, Select, message, DatePicker } from "antd";
import { useState } from "react";
import QuestionEmptyState from "../Questions/QuestionEmptyState";
import QuestionsList from "../Questions/QuestionsList";
import AIPrompt from "@/app/components/AIPrompt";

const { RangePicker } = DatePicker;

const { Option } = Select;

export const CurrencySelector = (
  <Form.Item initialValue={"USD"} name="compensation_currency" noStyle>
    <Select defaultValue={"USD"} className="min-w-[80px]">
      <Option value="USD">USD</Option>
      <Option value="INR">INR</Option>
    </Select>
  </Form.Item>
);

const CreateJobForm = ({ form }) => {
  const [questions, setQuestions] = useState([
    "How do you handle conflicts in your workplace ?",
    "When to disagree and commit and why?",
  ]);
  const onFinish = (values: any) => {
    fetch("/api/job/create", {
      method: "POST",
      body: JSON.stringify({
        ...transformJobPostingPayload(values),
        questions: {
          questions,
        },
      }),
    })
      .then((res) => {
        message.success("Job posting created successfully");
        return res.json();
      })
      .catch((err) => {
        message.error("Something went wrong while creating a job post");
        console.log("error", err);
      });
  };

  const showQuestionsEmptyState = questions?.length === 0;
  form.setFieldsValue({
    org_id: 1,
    status: "yet_to_start",
  });
  const offerType = Form.useWatch("offer_type", form);
  const showContractDuration =
    offerType === "contract" || offerType === "freelancing";

  const promptGenerationHandler = async (content, fieldName) => {
    const response = await fetch("/api/chatgpt", {
      method: "POST",
      body: JSON.stringify({ prompt: content }),
    });
    const data = await response.json();
    // form.setFields([{ name: fieldName, value: data?.content }]);
    form.setFieldsValue({
      [fieldName]: data?.content,
    });
  };

  return (
    <Form
      className="max-w-[750px] p-6 flex flex-col gap-y-5"
      form={form}
      name="job_posting"
      layout="vertical"
      onFinish={onFinish}
    >
      <div className="form-fields-container">
        <Form.Item
          label="Company Name"
          name="company_name"
          rules={[{ required: true, message: "Company name is required" }]}
        >
          <Input placeholder="Acme Inc." />
        </Form.Item>
        <Form.Item
          className="relative"
          name="company_description"
          label={
            <div className="flex items-center justify-between gap-x-2">
              <p>Culture of the company</p>
              <AIPrompt
                triggerText=""
                asyncSubmitHandler={async (content) => {
                  return promptGenerationHandler(
                    content,
                    "company_description"
                  );
                }}
              />
            </div>
          }
          rules={[
            { required: true, message: "Culture of the company is required" },
          ]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item
          className="relative"
          name="job_description"
          label={
            <div className="flex items-center justify-between gap-x-2">
              <p>Job Description</p>
              <AIPrompt
                triggerText=""
                asyncSubmitHandler={async (content) => {
                  return promptGenerationHandler(content, "job_description");
                }}
              />
            </div>
          }
          rules={[{ required: true }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item label="Role" name="role" rules={[{ required: true }]}>
          <Select
            options={[
              { label: "Designer", value: "designer" },
              { label: "Developer", value: "developer" },
              { label: "Product Manager", value: "product_manager" },
              { label: "Marketing", value: "marketing" },
              { label: "Sales", value: "sales" },
            ]}
          />
        </Form.Item>
        <Form.Item label="Offer" name="offer_type" rules={[{ required: true }]}>
          <Select
            options={[
              { label: "Full Time", value: "full_time" },
              { label: "Contract", value: "contract" },
              { label: "Freelancing", value: "freelancing" },
            ]}
          />
        </Form.Item>
        {showContractDuration && (
          <Form.Item label="Contract duration" name="contract_duration">
            <Input placeholder="6 months" />
          </Form.Item>
        )}

        <div className="flex items-center gap-x-3">
          <Form.Item
            className="flex-1"
            name="compensation_amount"
            label="Compensation Amount"
            rules={[{ required: true }]}
          >
            <Input addonBefore={CurrencySelector} placeholder="2000" />
          </Form.Item>
        </div>
        <Form.Item
          className="flex-1"
          name="location"
          label="Location"
          rules={[{ required: true }]}
        >
          <Input placeholder="Bangalore" />
        </Form.Item>
        <Form.Item className="flex-1 hidden" name="org_id" label="Organisation">
          <Input type="hidden" placeholder="Org_id" />
        </Form.Item>
        <Form.Item className="flex-1 hidden" name="status" label="Status">
          <Input type="hidden" placeholder="Status" />
        </Form.Item>
        <Form.Item
          label="Contest date"
          name="contest_date"
          rules={[{ required: true }]}
        >
          <RangePicker format="YYYY-MM-DD HH:mm:ss" showTime />
        </Form.Item>
      </div>
      <div className="form_question_section flex flex-col gap-y-4">
        <h2 className="font-semibold text-base">Questions</h2>
        {showQuestionsEmptyState && <QuestionEmptyState />}
        {!showQuestionsEmptyState && <QuestionsList questions={questions} />}
      </div>
      <Form.Item shouldUpdate>
        {() => (
          <Button
            type="primary"
            htmlType="submit"
            disabled={
              !!form.getFieldsError().filter(({ errors }) => errors.length)
                .length
            }
          >
            Submit
          </Button>
        )}
      </Form.Item>
    </Form>
  );
};

export default CreateJobForm;
