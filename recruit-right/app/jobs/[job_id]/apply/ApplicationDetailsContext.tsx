"use client";
import { createContext, useContext, useState } from "react";

const ApplicationDetailsContext = createContext({
  questions: [""],
  submissionId: "",
  ended_at: "",
  setCurrentSelectedQuestionIndex: (index) => null,
  currentSelectedQuestionIndex: 0,
});

export const useApplicationDetailsContext = () => {
  const params = useContext(ApplicationDetailsContext);
  return {
    ...params,
  };
};
const ApplicationDetailsProvider = ({ applicationDetails, children }) => {
  const [currentSelectedQuestionIndex, setCurrentSelectedQuestionIndex] =
    useState(0);

  return (
    <ApplicationDetailsContext.Provider
      value={{
        ...applicationDetails,
        currentSelectedQuestionIndex,
        setCurrentSelectedQuestionIndex,
      }}
    >
      {children}
    </ApplicationDetailsContext.Provider>
  );
};

export default ApplicationDetailsProvider;
