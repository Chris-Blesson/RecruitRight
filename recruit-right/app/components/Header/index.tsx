"use client";

import { useClerk } from "@clerk/nextjs";
import { useContext, useState, createContext } from "react";
import { PoweroffOutlined } from "@ant-design/icons";
const HeaderContext = createContext({
  label: <></>,
  setLabel: (labelText) => {},
});
const Header = () => {
  const { label } = useHeaderContext();
  const { signOut } = useClerk();
  return (
    <div
      className={
        "h-10 text-lg text-[#434343] px-3 flex items-center justify-between font-semibold bg-white shadow mb-5"
      }
    >
      <div>{label}</div>
      <div>
        <button
          onClick={() => {
            signOut();
            window?.location?.replace("/sign-in");
          }}
        >
          <PoweroffOutlined />
        </button>
      </div>
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
