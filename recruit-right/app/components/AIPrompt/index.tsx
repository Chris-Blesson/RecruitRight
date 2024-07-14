import Mic from "@/public/Icons/Mic";
import { IItem } from "./interface";
import { TONE_TYPES } from "./constants";
import Magic from "@/public/Icons/Magic";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Dropdown, Form, Input, Modal, message } from "antd";

const AIPrompt = ({
  prompt = "",
  triggerText,
  Trigger = ({ open }: { open: () => void }) => (
    <Button icon={<Magic />} type="text" onClick={open}>
      {triggerText ?? "Open AI Prompt"}
    </Button>
  ),
  asyncSubmitHandler,
}: {
  prompt?: string;
  triggerText?: string;
  Trigger?: ({ open }: { open: () => void }) => JSX.Element;
  asyncSubmitHandler: (promptContent: string) => Promise<any>;
}) => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tone, setTone] = useState((TONE_TYPES as IItem[])?.[0]?.key);

  useEffect(() => {
    form.setFieldsValue({
      prompt: "",
    });
  }, []);

  const onGenerateHandler = async (data) => {
    setLoading(true);
    const { tone, prompt } = data;

    try {
      await asyncSubmitHandler(
        `Generate a content for ${prompt} in a ${tone} tone manner`
      );
      setLoading(false);
      toggleModal();
    } catch (error) {
      setLoading(false);
      message.error("Something went wrong while generating prompt");
    }
  };

  const toggleModal = useCallback(() => {
    setIsModalOpen((prev) => !prev);
  }, []);

  const currentTone = useMemo(() => {
    const currentItem = (TONE_TYPES as IItem[]).find(
      (item) => item?.key === tone
    );
    return (currentItem as IItem)?.label;
  }, [tone]);

  const handleToneSelect = useCallback((e) => {
    const selectedTone = e?.key;
    setTone(selectedTone);
    form.setFieldsValue({
      tone: selectedTone,
    });
  }, []);

  return (
    <>
      <Trigger open={toggleModal} />
      <Modal
        width={"800px"}
        open={isModalOpen}
        title="AI Genie"
        footer={<></>}
        onCancel={toggleModal}
      >
        <Form
          className="max-w-[750px] flex flex-col gap-y-5"
          form={form}
          name="job_posting"
          layout="vertical"
          onFinish={onGenerateHandler}
        >
          <Form.Item initialValue={prompt} name="prompt" label="Prompt">
            <Input.TextArea
              defaultValue={prompt}
              placeholder="Tell me what you want to write about"
              rows={4}
            />
          </Form.Item>
          <Form.Item
            initialValue={tone}
            className="hidden"
            name="tone"
            label="Prompt"
          >
            <Input value={tone} hidden placeholder="tone" />
          </Form.Item>
          <div className="flex items-center justify-between">
            <div className="ai-tone">
              <Dropdown menu={{ items: TONE_TYPES, onClick: handleToneSelect }}>
                <Button icon={<Mic />}>{currentTone}</Button>
              </Dropdown>
            </div>
            <div className="prompt-actions flex items-center gap-x-2">
              <Button onClick={toggleModal} key="back">
                Cancel
              </Button>
              <Button
                disabled={loading}
                icon={<Magic />}
                key="submit"
                htmlType="submit"
                type="primary"
              >
                {loading ? "Generating...." : "Generate"}
              </Button>
            </div>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default AIPrompt;
