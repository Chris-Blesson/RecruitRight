"use client";
import { Button, Form, Input, Select } from "antd";
import { DatePicker } from "antd";

const { RangePicker } = DatePicker;

const CreateJobForm = () => {
  const [form] = Form.useForm();
  const onFinish = (values: any) => {
    console.log("Finish:", values);
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
          name="company_description"
          label="Culture of the company"
          rules={[
            { required: true, message: "Culture of the company is required" },
          ]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item
          name="job_description"
          label="Job Description"
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
        <Form.Item
          label="Contest date"
          name="contest_date"
          rules={[{ required: true }]}
        >
          <RangePicker showTime />
        </Form.Item>
      </div>
      <Form.Item shouldUpdate>
        {() => (
          <Button
            type="primary"
            htmlType="submit"
            disabled={
              !form.isFieldsTouched(true) ||
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
