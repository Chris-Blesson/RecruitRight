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
  institution,
  area,
  studyType,
  startDate,
  endDate,
  location,
}) => {
  return (
    <>
      <div>
        <p>Institution</p>
        <p>{institution}</p>
      </div>
      <div>
        <p>Area</p>
        <p>{area}</p>
      </div>
      <div>
        <p>Study Type</p>
        <p>{studyType || "NA"}</p>
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
        <p>Location</p>
        <p>{location}</p>
      </div>
    </>
  );
};

const EditEducationForm = ({
  institution,
  area,
  studyType,
  location,
  startDate,
  endDate,
  idxToUpdate,
  onSuccess,
  onError,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const { accountDetails, accountContextLoading, updateAccountDetails } =
    useAccountsContext();

  const educationResumePayload =
    accountDetails?.["resume_payload"]?.["education"];

  const initialValues = {
    institution,
    area,
    studyType,
    location,
    startDate,
    endDate,
  };
  const formItemData = [
    {
      label: "Institution",
      name: "institution",
      value: institution,
      placeholder: "Your institution",
    },
    {
      label: "Area",
      name: "area",
      value: area,
      placeholder: "Your specialisation",
    },
    {
      label: "Degree",
      name: "studyType",
      value: studyType,
      placeholder: "B.Tech",
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
      value: startDate,
      placeholder: "YYYY",
    },
    {
      label: "Till year",
      name: "endDate",
      value: endDate,
      placeholder: "YYYY",
    },
  ];

  const updateEducationDetails = (educationDetails) => {
    educationResumePayload[idxToUpdate] = educationDetails;
    const requestPayload = {
      ...accountDetails,
      resume_payload: {
        ...accountDetails["resume_payload"],
        education: [...educationResumePayload],
      },
    };
    updateAccountDetails(requestPayload, {
      onSuccess() {
        message.success("Education information updated successfully");
        onSuccess();
      },
      onError() {
        message.error(
          "Something went wrong while updating education information"
        );
        onError();
      },
    });
  };
  return (
    <Form
      form={form}
      initialValues={initialValues}
      onFinish={updateEducationDetails}
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

const AddEducationForm = ({ onSuccess, onError, onCancel }) => {
  const [form] = Form.useForm();
  const { accountDetails, accountContextLoading, updateAccountDetails } =
    useAccountsContext();

  const educationResumePayload =
    accountDetails?.["resume_payload"]?.["education"];

  const initialValues = {};
  const formItemData = [
    {
      label: "Institution",
      name: "institution",
      value: "",
      placeholder: "Your institution",
    },
    {
      label: "Area",
      name: "area",
      value: "",
      placeholder: "Your specialisation",
    },
    {
      label: "Degree",
      name: "studyType",
      value: "",
      placeholder: "B.Tech",
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
  ];

  const addEducationDetails = (educationDetails) => {
    const requestPayload = {
      ...accountDetails,
      resume_payload: {
        ...accountDetails["resume_payload"],
        education: [...educationResumePayload, { ...educationDetails }],
      },
    };
    updateAccountDetails(requestPayload, {
      onSuccess() {
        message.success("Education information added successfully");
        onSuccess();
      },
      onError() {
        message.error(
          "Something went wrong while updating education information"
        );
        onError();
      },
    });
  };
  return (
    <Form
      form={form}
      initialValues={initialValues}
      onFinish={addEducationDetails}
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

const PopConfirmDelete = ({ idx, deleteEducationInformation }) => {
  const [popConfirmOpen, setPopConfirmOpen] = useState(false);
  const onConfirm = () => {
    console.log("idx", idx);
    deleteEducationInformation({
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
      description="Are you sure to delete this education information?"
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
const Education = () => {
  const { accountDetails, accountContextLoading, updateAccountDetails } =
    useAccountsContext();

  const [addEducationModalOpen, setAddEducationModalOpen] = useState(false);

  const [editIndex, setEditIndex] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [educationDetails, setEducationDetails] = useState(
    accountDetails?.resume_payload?.education || []
  );

  useEffect(() => {
    setEducationDetails(accountDetails?.resume_payload?.education);
  }, [accountDetails]);
  if (!educationDetails?.length) {
    return <p>Not available yet</p>;
  }

  const deleteEducationInformation = ({ idx, onSuccess, onError }) => {
    educationDetails.splice(idx, 1);
    const requestPayload = {
      ...accountDetails,
      resume_payload: {
        ...accountDetails["resume_payload"],
        education: [...educationDetails],
      },
    };
    updateAccountDetails(requestPayload, {
      onSuccess() {
        message.success("Education information updated successfully");
        onSuccess();
      },
      onError() {
        message.error(
          "Something went wrong while updating education information"
        );
        onError();
      },
    });
  };
  const EditOrDeleteEducation = ({ idx }) => {
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
          deleteEducationInformation={deleteEducationInformation}
        />
      </div>
    );
  };
  const readOnlyViewData = educationDetails.map((education, idx) => {
    const label = education.studyType
      ? `${education.studyType} - ${education.area || "NA"}`
      : education.area;
    return {
      label,
      key: idx,
      children: <ReadOnlyViewCollapsibleContent {...education} />,
      extra: EditOrDeleteEducation({ idx }),
    };
  });

  const closeEditModal = () => {
    setEditModalOpen(false);
  };

  const closeAddEducationModal = () => {
    setAddEducationModalOpen(false);
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
                setAddEducationModalOpen(true);
              }}
            >
              Add Education
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
          {...educationDetails[editIndex]}
          onSuccess={closeEditModal}
          onError={closeEditModal}
          onCancel={closeEditModal}
          idxToUpdate={editIndex}
        />
      </Modal>
      <Modal
        title="Add Education information"
        centered
        open={addEducationModalOpen}
        closeIcon={<></>}
        footer={[]}
      >
        <AddEducationForm
          {...educationDetails[editIndex]}
          onSuccess={closeAddEducationModal}
          onError={closeAddEducationModal}
          onCancel={closeAddEducationModal}
        />
      </Modal>
    </>
  );
};

export default Education;
