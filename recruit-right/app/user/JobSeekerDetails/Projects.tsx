//TODO: Find a better way to show the skills

"use client";
import { useAccountsContext } from "@/app/components/AccountsContext";
import {
  Button,
  Collapse,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Space,
} from "antd";
import { useEffect, useState } from "react";
import { EditOutlined, DeleteOutlined, BulbOutlined } from "@ant-design/icons";
import Suggestions from "./Suggestions";
const ReadOnlyViewCollapsibleContent = ({
  name,
  description,
  keywords,
  url,
}) => {
  return (
    <>
      <div className="mb-2">
        <h2 className="font-bold text-lg">Name</h2>
        <p>{name}</p>
      </div>
      <div className="mb-2">
        <h2 className="font-bold text-lg">Description</h2>
        <p>{description}</p>
      </div>
      <div className="mb-2">
        <h2 className="font-bold text-lg">Skills/Tools used</h2>
        <p>{keywords?.join()}</p>
      </div>
      <div className="mb-2">
        <h2 className="font-bold text-lg">Live URL</h2>
        <p>{url || "NA"}</p>
      </div>
    </>
  );
};

const EditProjectsForm = ({
  name,
  description,
  keywords,
  url,
  idxToUpdate,
  onSuccess,
  onError,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const { accountDetails, accountContextLoading, updateAccountDetails } =
    useAccountsContext();
  console.log("edit projects", { name, description, keywords, url });
  const projectResumePayload = accountDetails?.["resume_payload"]?.["projects"];

  const initialValues = {
    name,
    description,
    keywords: keywords.join(),
    url,
  };
  const formItemData = [
    {
      label: "Project Name",
      name: "name",
      value: name,
      placeholder: "",
    },
    {
      label: "Description",
      name: "description",
      value: description,
      placeholder: "",
    },
    {
      label: "Skills/Tools used",
      name: "keywords",
      value: keywords.join(),
      placeholder: "",
    },
    {
      label: "Live URL",
      name: "url",
      value: url,
      placeholder: "Enter 'NA' if not available",
    },
  ];

  const updateProjectDetails = (projectDetails) => {
    projectResumePayload[idxToUpdate] = {
      ...projectDetails,
      keywords: projectDetails.keywords.split(","),
    };
    const requestPayload = {
      ...accountDetails,
      resume_payload: {
        ...accountDetails["resume_payload"],
        projects: [...projectResumePayload],
      },
    };
    updateAccountDetails(requestPayload, {
      onSuccess() {
        message.success("Project information updated successfully");
        onSuccess();
      },
      onError() {
        message.error(
          "Something went wrong while updating project information"
        );
        onError();
      },
    });
  };
  return (
    <Form
      form={form}
      initialValues={initialValues}
      onFinish={updateProjectDetails}
      layout="vertical"
    >
      {formItemData.map((formItem) => {
        return (
          <Form.Item
            key={formItem.label}
            name={formItem.name}
            label={formItem.label}
            rules={[{ required: true }]}
          >
            <Input placeholder={formItem.placeholder} />
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
              form.resetFields();
              onCancel();
            }}
            disabled={accountContextLoading}
          >
            Cancel
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

const AddProjectForm = ({ onSuccess, onError, onCancel }) => {
  const [form] = Form.useForm();
  const { accountDetails, accountContextLoading, updateAccountDetails } =
    useAccountsContext();

  const projectResumePayload = accountDetails?.["resume_payload"]?.["projects"];

  const initialValues = {};
  const formItemData = [
    {
      label: "Name",
      name: "name",
      value: "",
      placeholder: "Google",
    },
    {
      label: "Description",
      name: "description",
      value: "",
      placeholder: "",
    },
    {
      label: "Skills/Tools used",
      name: "keywords",
      value: "",
      placeholder: "",
    },
    {
      label: "Live project URL",
      name: "url",
      value: "",
      placeholder: "Enter 'NA' if not available",
    },
  ];

  const addProject = (projectDetails) => {
    const requestPayload = {
      ...accountDetails,
      resume_payload: {
        ...accountDetails["resume_payload"],
        projects: [
          ...projectResumePayload,
          { ...projectDetails, keywords: projectDetails.keywords.split(",") },
        ],
      },
    };
    updateAccountDetails(requestPayload, {
      onSuccess() {
        message.success("Project information added successfully");
        onSuccess();
      },
      onError() {
        message.error("Something went wrong while adding project information");
        onError();
      },
    });
  };
  return (
    <Form
      form={form}
      initialValues={initialValues}
      onFinish={addProject}
      layout="vertical"
    >
      {formItemData.map((formItem) => {
        return (
          <Form.Item
            key={formItem.label}
            name={formItem.name}
            label={formItem.label}
            rules={[{ required: true }]}
          >
            <Input placeholder={formItem.placeholder} />
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
              form.resetFields();
              onCancel();
            }}
            disabled={accountContextLoading}
          >
            Cancel
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

const PopConfirmDelete = ({ idx, deleteProject }) => {
  const [popConfirmOpen, setPopConfirmOpen] = useState(false);
  const onConfirm = () => {
    deleteProject({
      idx,
      onSuccess: () => {
        setPopConfirmOpen(false);
      },
      onError: () => {
        setPopConfirmOpen(false);
      },
    });
  };

  return (
    <Popconfirm
      title="Delete?"
      description="Are you sure to delete this work information?"
      onConfirm={onConfirm}
      onCancel={() => {
        setPopConfirmOpen(false);
      }}
      okText="Yes"
      cancelText="No"
      placement="left"
      open={popConfirmOpen}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          setPopConfirmOpen(true);
        }}
      >
        <DeleteOutlined />
      </button>
    </Popconfirm>
  );
};
const Projects = () => {
  const { accountDetails, accountContextLoading, updateAccountDetails } =
    useAccountsContext();

  const [addProjectModalOpen, setAddProjectModalOpen] = useState(false);

  const [editIndex, setEditIndex] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [projects, setProjects] = useState(
    accountDetails?.resume_payload?.projects || []
  );

  useEffect(() => {
    setProjects(accountDetails?.resume_payload?.projects);
  }, [accountDetails]);
  if (!projects?.length) {
    return <p>Not available yet</p>;
  }

  const deleteProject = ({ idx, onSuccess, onError }) => {
    projects.splice(idx, 1);
    const requestPayload = {
      ...accountDetails,
      resume_payload: {
        ...accountDetails["resume_payload"],
        projects: [...projects],
      },
    };
    updateAccountDetails(requestPayload, {
      onSuccess() {
        message.success("Project updated successfully");
        onSuccess();
      },
      onError() {
        message.error("Something went wrong while updating the project");
        onError();
      },
    });
  };
  const EditOrDeleteProject = ({ idx }) => {
    const [isSuggestionsModalOpen, setIsSuggestionModalOpen] = useState(false);
    return (
      <div className="flex items-center">
        {!!projects?.[idx]?.["improvements_suggestions"]?.length && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsSuggestionModalOpen(true);
            }}
            className="mr-4"
          >
            <BulbOutlined />
          </button>
        )}
        <button
          className="mr-4"
          onClick={(e) => {
            e.stopPropagation();
            setEditModalOpen(true);
            setEditIndex(idx);
          }}
        >
          <EditOutlined />
        </button>
        <PopConfirmDelete idx={idx} deleteProject={deleteProject} />
        <Modal
          open={isSuggestionsModalOpen}
          cancelText="Done"
          onOk={() => {
            setIsSuggestionModalOpen(false);
          }}
          onCancel={() => {
            setIsSuggestionModalOpen(false);
          }}
          closable={false}
        >
          <Suggestions
            suggestions={projects?.[idx]?.["improvements_suggestions"]}
          />
        </Modal>
      </div>
    );
  };
  const readOnlyViewData = projects.map((project, idx) => {
    const label = project.name || "NA";
    return {
      label,
      key: idx,
      children: <ReadOnlyViewCollapsibleContent {...project} />,
      extra: EditOrDeleteProject({ idx }),
    };
  });

  const closeEditModal = () => {
    setEditModalOpen(false);
  };

  const closeAddProjectModal = () => {
    setAddProjectModalOpen(false);
  };
  return (
    <>
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3>Projects</h3>
          <div>
            <Button
              type="primary"
              onClick={() => {
                setAddProjectModalOpen(true);
              }}
            >
              Add Project
            </Button>
          </div>
        </div>
        <div>
          <Collapse
            items={readOnlyViewData}
            defaultActiveKey={["0"]}
            accordion
          />
        </div>
      </div>
      <Modal
        title="Edit Education information"
        centered
        open={editModalOpen}
        closeIcon={<></>}
        footer={[]}
      >
        <EditProjectsForm
          {...projects[editIndex]}
          onSuccess={closeEditModal}
          onError={closeEditModal}
          onCancel={closeEditModal}
          idxToUpdate={editIndex}
        />
      </Modal>
      <Modal
        title="Add Education information"
        centered
        open={addProjectModalOpen}
        closeIcon={<></>}
        footer={[]}
      >
        <AddProjectForm
          {...projects[editIndex]}
          onSuccess={closeAddProjectModal}
          onError={closeAddProjectModal}
          onCancel={closeAddProjectModal}
        />
      </Modal>
    </>
  );
};

export default Projects;
