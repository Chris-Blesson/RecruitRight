"use client";

import { useContext, useState, createContext } from "react";

const HeaderContext = createContext({
  label: <></>,
  setLabel: (labelText) => {},
});
const Header = () => {
  const { label } = useHeaderContext();
  return (
    <div
      className={
        "h-10 text-lg text-[#434343] pl-3 flex items-center font-semibold bg-white shadow mb-5"
      }
    >
      {label}
    </div>
  );
};

export const useHeaderContext = () => {
  const params = useContext(HeaderContext);
  return {
    ...params,
  };
};

export const HeaderContextProvider = ({ children }) => {
  const [label, setLabel] = useState(<></>);
  return (
    <HeaderContext.Provider
      value={{
        label,
        setLabel,
      }}
    >
      {children}
    </HeaderContext.Provider>
  );
};

export default Header;
