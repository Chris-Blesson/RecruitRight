"use client";
import BulbIcon from "@/public/Icons/BulbIcon";
import { Button, Drawer, message } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useState } from "react";
import CreateTemplateForm from "./Forms/CreateTemplateForm";

const TemplatesPanel = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const toggleDrawer = () => setIsDrawerOpen((prev) => !prev);
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
  return (
    <div className="h-[320px]  w-full">
      <div className="p-20">
        <div className="flex flex-col gap-y-2">
          <div className=" flex  justify-center">
            <BulbIcon width="40" height="40" />
          </div>
          <p className="flex justify-center">No templates available</p>
          <Button
            onClick={toggleDrawer}
            type="link"
            className="text-blue-600 hover:!text-blue-700"
            icon={<PlusCircleOutlined />}
          >
            Create Template
          </Button>
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
      </div>
    </div>
  );
};

export default TemplatesPanel;
