import QuestionIcon from "@/public/Icons/QuestionIcon";
import { Button } from "antd";
import { SyncOutlined } from "@ant-design/icons";
const QuestionEmptyState = () => {
  return (
    <div className="flex flex-col gap-y-3 items-center">
      <QuestionIcon />
      <Button
        icon={<SyncOutlined />}
        className="font-semibold border-gray-100"
        type="text"
      >
        Generate Questions
      </Button>
    </div>
  );
};

export default QuestionEmptyState;
