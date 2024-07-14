"use client";
import { Button, Form, Input } from "antd";
const CreateTemplateForm = ({ onSubmitHandler, onCancelClick }) => {
  const [form] = Form.useForm();
  return (
    <Form
      className="flex flex-col gap-y-5 flex-1"
      form={form}
      name="create_template"
      layout="vertical"
      onFinish={onSubmitHandler}
    >
      <div className="form-fields-container flex-1">
        <Form.Item
          label="Template Name"
          name="template_name"
          rules={[{ required: true, message: "Template name is required" }]}
        >
          <Input placeholder="Company Template" />
        </Form.Item>
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
      </div>
      <div className="actions flex items-center gap-x-3 justify-end">
        <Button type="default" onClick={onCancelClick}>
          Cancel
        </Button>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </div>
    </Form>
  );
};

export default CreateTemplateForm;
