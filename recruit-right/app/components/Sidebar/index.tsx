"use client";
import { Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import {
  RedEnvelopeOutlined,
  ContactsOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useAccountsContext } from "../AccountsContext";
import { ACCOUNT_TYPE } from "@/constants/accountTypes";
const Sidebar = () => {
  const user = useAccountsContext();
  const isRecruiter = user.accountDetails.type === ACCOUNT_TYPE.RECRUITER;
  const sidebarMenu = isRecruiter
    ? [
        {
          key: "jobs",
          label: <Link href="/jobs">Jobs</Link>,
          icon: <RedEnvelopeOutlined />,
        },
      ]
    : [
        {
          key: "profile",
          label: <Link href="/user">My Profile</Link>,
          icon: <UserOutlined />,
        },
        {
          key: "jobs",
          label: <Link href="/jobs">Jobs</Link>,
          icon: <RedEnvelopeOutlined />,
        },
        {
          key: "applications",
          label: <Link href="applications">My Applications</Link>,
          icon: <ContactsOutlined />,
        },
      ];

  return (
    <Sider
      style={{
        overflow: "auto",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
      }}
    >
      <div className="h-10 text-white flex items-center pl-6">
        <h2 className="text-lg">Recruit Right</h2>
      </div>

      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={["jobs"]}
        items={sidebarMenu}
      />
    </Sider>
  );
};

export default Sidebar;
