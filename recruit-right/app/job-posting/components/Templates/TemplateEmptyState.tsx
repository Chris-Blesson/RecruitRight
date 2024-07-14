import { Button } from "antd";
import BulbIcon from "@/public/Icons/BulbIcon";
import { PlusCircleOutlined } from "@ant-design/icons";

const TemplateEmptyState = ({
  toggleDrawer,
  isDrawerOpen,
  handleTemplateSave,
}) => {
  return (
    <div className="flex flex-col gap-y-2 p-20">
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
    </div>
  );
};

export default TemplateEmptyState;
