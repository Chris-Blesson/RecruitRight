"use client";
import { Form } from "antd";
import CreateJobForm from "./Forms/CreateJobForm";
import TemplatesPanel from "./Templates/TemplatesPanel";
import { ITemplate } from "./Templates/TemplatesList";

const CreateJobPost = () => {
  const [form] = Form.useForm();

  const applyTemplate = ({ template }: { template: ITemplate }) => {
    form.setFieldsValue({
      company_name: template?.company_name,
      company_description: template?.company_description,
    });
  };
  return (
    <div className="create-job-post-layout m-6  bg-white flex-1 rounded-lg shadow-lg">
      <div className="p-4">
        <div className="flex justify-between">
          <div
            className="form-container flex relative flex-col flex-1 after:content-['&nbsp;'] after:h-full after:border  after:absolute
        after:right-[5%] after:border-gray-100"
          >
            <h1 className="text-lg font-bold">Create Job Posting</h1>
            <CreateJobForm form={form} />
          </div>
          <div className="templates-section flex flex-col gap-y-3 flex-1 max-w-[375px] w-full">
            <TemplatesPanel applyTemplate={applyTemplate} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateJobPost;
