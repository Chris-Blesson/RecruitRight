"use client";

import { DatePicker, Form, Input, Button, message } from "antd";

const { RangePicker } = DatePicker;
import { CurrencySelector } from "@/app/job-posting/components/Forms/CreateJobForm";
import { useCallback } from "react";
import { transformJobPostingPayload } from "@/app/utils/transforms";

const EditJobDetailsPane = ({
  jobId,
  compensationCurrency,
  compensationAmount,
  location,
}: {
  jobId: string;
  compensationCurrency: string;
  compensationAmount: string;
  location: string;
}) => {
  const [form] = Form.useForm();

  const onUpdateJobDetails = useCallback((payload) => {
    fetch(`/api/job/${jobId}`, {
      method: "PUT",
      body: JSON.stringify({
        ...transformJobPostingPayload(payload),
      }),
    })
      .then((res) => {
        message.success("Job posting updated successfully");
        return res.json();
      })
      .catch((err) => {
        message.error("Something went wrong while updating a job post");
        console.log("error", err);
      });
  }, []);

  return (
    <div className="bg-white rounded-lg p-6 font-medium flex flex-col gap-y-3 h-full max-w-[460px]">
      <h1 className="text-lg font-bold">Edit Job Details</h1>
      <Form
        className="p-2 flex flex-col gap-y-1 h-full"
        form={form}
        name="edit_job_posting"
        layout="vertical"
        onFinish={onUpdateJobDetails}
      >
        <div className="edit-form-section flex-1">
          <div className="flex items-center gap-x-3">
            <Form.Item
              initialValue={compensationAmount}
              className="flex-1"
              name="compensation_amount"
              label="Compensation Amount"
            >
              <Input addonBefore={CurrencySelector} placeholder="2000" />
            </Form.Item>
          </div>
          <Form.Item
            initialValue={location}
            className="flex-1"
            name="location"
            label="Location"
          >
            <Input placeholder="Bangalore" />
          </Form.Item>
          <Form.Item label="Contest date" name="contest_date">
            <RangePicker format="YYYY-MM-DD HH:mm:ss" showTime />
          </Form.Item>
        </div>

        <Form.Item className="flex justify-end" shouldUpdate>
          {() => (
            <Button
              type="primary"
              htmlType="submit"
              disabled={
                !!form.getFieldsError().filter(({ errors }) => errors.length)
                  .length
              }
            >
              Update
            </Button>
          )}
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditJobDetailsPane;
