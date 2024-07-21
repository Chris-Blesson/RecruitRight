import AccountsContextProvider from "./components/AccountsContext";

const RecruitRightAppLayout = ({ children }) => {
  return <AccountsContextProvider>{children}</AccountsContextProvider>;
};

export default RecruitRightAppLayout;
