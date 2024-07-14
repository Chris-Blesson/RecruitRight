"use client";
import { useEffect, useState } from "react";
import TemplateEmptyState from "./TemplateEmptyState";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, message, Drawer } from "antd";
import TemplatesList, { ITemplate } from "./TemplatesList";
import CreateTemplateForm from "../Forms/CreateTemplateForm";

const TemplatesPanel = ({
  applyTemplate,
}: {
  applyTemplate: ({ template }: { template: ITemplate }) => void;
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const toggleDrawer = () => setIsDrawerOpen((prev) => !prev);
  const [isLoading, setIsLoading] = useState(false);
  const [templatesData, setTemplates] = useState([]);
  const showEmptyState = !isLoading && templatesData?.length === 0;
  const showTemplates = !isLoading && templatesData?.length !== 0;
  const handleTemplateSave = (data) => {
    fetch("/api/templates/create", {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then((res) => {
        toggleDrawer();
        message.success("Template created successfully");
        return res.json();
      })
      .catch((err) => {
        message.error("Something went wrong while creating a template");
        console.log("error", err);
      });
  };

  const fetchTemplates = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/templates");
      const templates = await response.json();
      setTemplates(templates);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  return (
    <div className="h-[320px] w-full flex flex-col gap-y-3">
      <div className="templates-header flex items-center justify-between">
        <h2 className="text-lg font-bold">Templates</h2>
        {showTemplates && (
          <Button icon={<PlusCircleOutlined />} onClick={toggleDrawer}>
            Add
          </Button>
        )}
      </div>
      {showEmptyState && (
        <TemplateEmptyState
          handleTemplateSave={handleTemplateSave}
          isDrawerOpen={isDrawerOpen}
          toggleDrawer={toggleDrawer}
        />
      )}
      {showTemplates && (
        <TemplatesList
          applyTemplate={applyTemplate}
          templates={templatesData}
        />
      )}
      <Drawer
        title="Create Template"
        placement="right"
        onClose={toggleDrawer}
        open={isDrawerOpen}
        key={"create-template"}
      >
        <div className="flex flex-col h-full">
          <CreateTemplateForm
            onCancelClick={toggleDrawer}
            onSubmitHandler={handleTemplateSave}
          />
        </div>
      </Drawer>
    </div>
  );
};

export default TemplatesPanel;
