//TODO: Find a better way to show the highlights

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
const ReadOnlyViewCollapsibleContent = ({ name, keywords }) => {
  return (
    <>
      <div className="mb-2">
        <h2 className="font-bold text-lg">Category</h2>
        <p>{name}</p>
      </div>
      <div>
        <h2 className="font-bold text-lg">Skills/Tools known</h2>
        <p>{keywords.join()}</p>
      </div>
    </>
  );
};

const EditSkills = ({
  name,
  keywords,
  idxToUpdate,
  onSuccess,
  onError,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const { accountDetails, accountContextLoading, updateAccountDetails } =
    useAccountsContext();

  const skillsResumePayload = accountDetails?.["resume_payload"]?.["skills"];

  const initialValues = {
    name,
    keywords: keywords.join(),
  };
  const formItemData = [
    {
      label: "Category",
      name: "name",
      value: name,
      placeholder: "Programming",
    },
    {
      label: "Skills/Tools",
      name: "keywords",
      value: keywords,
      placeholder: "React, HTML and JS",
    },
  ];

  const updateSkillsDetails = (skillDetails) => {
    skillsResumePayload[idxToUpdate] = {
      ...skillDetails,
      keywords: skillDetails.keywords.split(","),
    };
    const requestPayload = {
      ...accountDetails,
      resume_payload: {
        ...accountDetails["resume_payload"],
        skills: [...skillsResumePayload],
      },
    };
    updateAccountDetails(requestPayload, {
      onSuccess() {
        message.success("Skills updated successfully");
        onSuccess();
      },
      onError() {
        message.error("Something went wrong while updating skills information");
        onError();
      },
    });
  };
  return (
    <Form
      form={form}
      initialValues={initialValues}
      onFinish={updateSkillsDetails}
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

const AddSkillsForm = ({ onSuccess, onError, onCancel }) => {
  const [form] = Form.useForm();
  const { accountDetails, accountContextLoading, updateAccountDetails } =
    useAccountsContext();

  const skillsResumePayload = accountDetails?.["resume_payload"]?.["skills"];

  const initialValues = {};
  const formItemData = [
    {
      label: "Catgory",
      name: "name",
      value: "",
      placeholder: "Programming",
    },
    {
      label: "Skills/Tools",
      name: "keywords",
      value: "",
      placeholder: "React, node.js and HTML",
    },
  ];

  const addSkills = (skillDetails) => {
    const requestPayload = {
      ...accountDetails,
      resume_payload: {
        ...accountDetails["resume_payload"],
        skills: [
          ...skillsResumePayload,
          { ...skillDetails, keywords: skillDetails.keywords.split(",") },
        ],
      },
    };
    updateAccountDetails(requestPayload, {
      onSuccess() {
        message.success("Skill added successfully");
        onSuccess();
      },
      onError() {
        message.error("Something went wrong while adding skill information");
        onError();
      },
    });
  };
  return (
    <Form
      form={form}
      initialValues={initialValues}
      onFinish={addSkills}
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

const PopConfirmDelete = ({ idx, deleteSkills }) => {
  const [popConfirmOpen, setPopConfirmOpen] = useState(false);
  const onConfirm = () => {
    deleteSkills({
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
const Skills = () => {
  const { accountDetails, accountContextLoading, updateAccountDetails } =
    useAccountsContext();

  const [addSkillsModalOpen, setAddSkillsModalOpen] = useState(false);

  const [editIndex, setEditIndex] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [skillsDetails, setSkillsDetails] = useState(
    accountDetails?.resume_payload?.skills || []
  );

  useEffect(() => {
    setSkillsDetails(accountDetails?.resume_payload?.skills);
  }, [accountDetails]);
  if (!skillsDetails?.length) {
    return <p>Not available yet</p>;
  }

  const deleteSkills = ({ idx, onSuccess, onError }) => {
    skillsDetails.splice(idx, 1);
    const requestPayload = {
      ...accountDetails,
      resume_payload: {
        ...accountDetails["resume_payload"],
        skills: [...skillsDetails],
      },
    };
    updateAccountDetails(requestPayload, {
      onSuccess() {
        message.success("Skills updated successfully");
        onSuccess();
      },
      onError() {
        message.error("Something went wrong while updating Skills");
        onError();
      },
    });
  };
  const EditOrDeleteSkills = ({ idx }) => {
    const [isSuggestionsModalOpen, setIsSuggestionModalOpen] = useState(false);
    return (
      <div className="flex items-center">
        {!!skillsDetails?.[idx]?.["improvments_suggestions"]?.length && (
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
        <PopConfirmDelete idx={idx} deleteSkills={deleteSkills} />
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
            suggestions={skillsDetails?.[idx]?.["improvments_suggestions"]}
          />
        </Modal>
      </div>
    );
  };
  const readOnlyViewData = skillsDetails.map((skill, idx) => {
    const label = skill.name;
    return {
      label,
      key: idx,
      children: <ReadOnlyViewCollapsibleContent {...skill} />,
      extra: EditOrDeleteSkills({ idx }),
    };
  });

  const closeEditModal = () => {
    setEditModalOpen(false);
  };

  const closeAddSkillModal = () => {
    setAddSkillsModalOpen(false);
  };
  return (
    <>
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3>Skills</h3>
          <div>
            <Button
              type="primary"
              onClick={() => {
                setAddSkillsModalOpen(true);
              }}
            >
              Add Skills
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
        <EditSkills
          {...skillsDetails[editIndex]}
          onSuccess={closeEditModal}
          onError={closeEditModal}
          onCancel={closeEditModal}
          idxToUpdate={editIndex}
        />
      </Modal>
      <Modal
        title="Add Education information"
        centered
        open={addSkillsModalOpen}
        closeIcon={<></>}
        footer={[]}
      >
        <AddSkillsForm
          onSuccess={closeAddSkillModal}
          onError={closeAddSkillModal}
          onCancel={closeAddSkillModal}
        />
      </Modal>
    </>
  );
};

export default Skills;
