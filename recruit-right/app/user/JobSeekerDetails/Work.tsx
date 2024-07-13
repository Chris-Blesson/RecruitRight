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
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
const ReadOnlyViewCollapsibleContent = ({
  company,
  position,
  startDate,
  endDate,
  location,
  highlights,
}) => {
  return (
    <>
      <div>
        <p>Company</p>
        <p>{company}</p>
      </div>
      <div>
        <p>Position</p>
        <p>{position}</p>
      </div>
      <div>
        <p>Location</p>
        <p>{location}</p>
      </div>
      <div>
        <p>From</p>
        <p>{startDate || "NA"}</p>
      </div>
      <div>
        <p>Till</p>
        <p>{endDate || "NA"}</p>
      </div>
      <div>
        <p>Highlights</p>
        <p>{highlights?.join()}</p>
      </div>
    </>
  );
};

const EditEducationForm = ({
  company,
  position,
  location,
  startDate,
  endDate,
  highlights,
  idxToUpdate,
  onSuccess,
  onError,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const { accountDetails, accountContextLoading, updateAccountDetails } =
    useAccountsContext();

  const workResumePayload = accountDetails?.["resume_payload"]?.["work"];

  const initialValues = {
    company,
    position,
    highlights: highlights.join(),
    location,
    startDate,
    endDate,
  };
  const formItemData = [
    {
      label: "Company",
      name: "company",
      value: company,
      placeholder: "Company you worked in",
    },
    {
      label: "Position",
      name: "position",
      value: position,
      placeholder: "Software Engineer",
    },
    {
      label: "location",
      name: "location",
      value: location,
      placeholder: "Bangalore, India",
    },
    {
      label: "From year",
      name: "startDate",
      value: startDate,
      placeholder: "YYYY",
    },
    {
      label: "Till year",
      name: "endDate",
      value: endDate,
      placeholder: "YYYY",
    },
    {
      label: "Highlights",
      name: "highlights",
      value: highlights,
      placeholder: "Enter as comma separated values for multiple lines",
    },
  ];

  const updateWorkDetails = (workDetails) => {
    workResumePayload[idxToUpdate] = {
      ...workDetails,
      highlights: workDetails.highlights.split(","),
    };
    const requestPayload = {
      ...accountDetails,
      resume_payload: {
        ...accountDetails["resume_payload"],
        work: [...workResumePayload],
      },
    };
    updateAccountDetails(requestPayload, {
      onSuccess() {
        message.success("Work information updated successfully");
        onSuccess();
      },
      onError() {
        message.error("Something went wrong while updating work information");
        onError();
      },
    });
  };
  return (
    <Form
      form={form}
      initialValues={initialValues}
      onFinish={updateWorkDetails}
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

const AddWorkExperienceForm = ({ onSuccess, onError, onCancel }) => {
  const [form] = Form.useForm();
  const { accountDetails, accountContextLoading, updateAccountDetails } =
    useAccountsContext();

  const workResumePayload = accountDetails?.["resume_payload"]?.["work"];

  const initialValues = {};
  const formItemData = [
    {
      label: "Company",
      name: "company",
      value: "",
      placeholder: "Google",
    },
    {
      label: "Position",
      name: "position",
      value: "",
      placeholder: "Software Engineer",
    },
    {
      label: "Location",
      name: "location",
      value: location,
      placeholder: "Bangalore, India",
    },
    {
      label: "From year",
      name: "startDate",
      value: "",
      placeholder: "YYYY",
    },
    {
      label: "Till year",
      name: "endDate",
      value: "",
      placeholder: "YYYY",
    },
    {
      label: "Highlights",
      name: "highlights",
      value: "",
      placeholder: "Enter as a comma separated values for multiple highlights",
    },
  ];

  const addWorkExperience = (workDetails) => {
    const requestPayload = {
      ...accountDetails,
      resume_payload: {
        ...accountDetails["resume_payload"],
        work: [
          ...workResumePayload,
          { ...workDetails, highlights: workDetails.highlights.split(",") },
        ],
      },
    };
    updateAccountDetails(requestPayload, {
      onSuccess() {
        message.success("Work information added successfully");
        onSuccess();
      },
      onError() {
        message.error("Something went wrong while adding work information");
        onError();
      },
    });
  };
  return (
    <Form
      form={form}
      initialValues={initialValues}
      onFinish={addWorkExperience}
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

const PopConfirmDelete = ({ idx, deleteWorkExperience }) => {
  const [popConfirmOpen, setPopConfirmOpen] = useState(false);
  const onConfirm = () => {
    deleteWorkExperience({
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
const Work = () => {
  const { accountDetails, accountContextLoading, updateAccountDetails } =
    useAccountsContext();

  const [addWorkExperienceModalOpen, setAddWorkExperienceModalOpen] =
    useState(false);

  const [editIndex, setEditIndex] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [workExperience, setWorkExperience] = useState(
    accountDetails?.resume_payload?.work || []
  );

  useEffect(() => {
    setWorkExperience(accountDetails?.resume_payload?.work);
  }, [accountDetails]);
  if (!workExperience?.length) {
    return <p>Not available yet</p>;
  }

  const deleteWorkExperience = ({ idx, onSuccess, onError }) => {
    workExperience.splice(idx, 1);
    const requestPayload = {
      ...accountDetails,
      resume_payload: {
        ...accountDetails["resume_payload"],
        work: [...workExperience],
      },
    };
    updateAccountDetails(requestPayload, {
      onSuccess() {
        message.success("Work experience updated successfully");
        onSuccess();
      },
      onError() {
        message.error(
          "Something went wrong while updating work experience information"
        );
        onError();
      },
    });
  };
  const EditOrDeleteWorkExperience = ({ idx }) => {
    return (
      <div className="flex items-center">
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
        <PopConfirmDelete
          idx={idx}
          deleteWorkExperience={deleteWorkExperience}
        />
      </div>
    );
  };
  const readOnlyViewData = workExperience.map((work, idx) => {
    const label = work.company
      ? `${work.company} - ${work.position || "NA"}`
      : work.position;
    return {
      label,
      key: idx,
      children: <ReadOnlyViewCollapsibleContent {...work} />,
      extra: EditOrDeleteWorkExperience({ idx }),
    };
  });

  const closeEditModal = () => {
    setEditModalOpen(false);
  };

  const closeAddEducationModal = () => {
    setAddWorkExperienceModalOpen(false);
  };
  return (
    <>
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3>Basic Information</h3>
          <div>
            <Button
              type="primary"
              onClick={() => {
                setAddWorkExperienceModalOpen(true);
              }}
            >
              Add Work experience
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
        <EditEducationForm
          {...workExperience[editIndex]}
          onSuccess={closeEditModal}
          onError={closeEditModal}
          onCancel={closeEditModal}
          idxToUpdate={editIndex}
        />
      </Modal>
      <Modal
        title="Add Education information"
        centered
        open={addWorkExperienceModalOpen}
        closeIcon={<></>}
        footer={[]}
      >
        <AddWorkExperienceForm
          {...workExperience[editIndex]}
          onSuccess={closeAddEducationModal}
          onError={closeAddEducationModal}
          onCancel={closeAddEducationModal}
        />
      </Modal>
    </>
  );
};

export default Work;
