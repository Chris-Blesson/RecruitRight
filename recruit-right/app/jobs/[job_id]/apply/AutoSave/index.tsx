"use client";

import { useEffect, useState } from "react";
import { useAnswerContext } from "../AnswerContext";
import { Tag } from "antd";

const AutoSave = () => {
  const [isSaveHappened, setIsSaveHappened] = useState(false);
  const { answers, onSaveHandler } = useAnswerContext();

  useEffect(() => {
    const autoSaveHandlerTimeout = setTimeout(() => {
      const isHavingAnswers = Object.keys(answers).length;
      if (isHavingAnswers) {
        onSaveHandler(() => {
          setIsSaveHappened(true);
          setTimeout(() => {
            setIsSaveHappened(false);
          }, 1500);
        });
      }
    }, 10000);
    return () => clearTimeout(autoSaveHandlerTimeout);
  }, [answers]);

  return (
    <Tag color="lime">
      {isSaveHappened && <p className="text-sm italic">Saved Successfully!</p>}
    </Tag>
  );
};

export default AutoSave;
