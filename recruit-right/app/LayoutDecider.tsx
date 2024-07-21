"use client";

import { usePathname } from "next/navigation";
import RecruitRightAppLayout from "./RecruitRightAppLayout";

const LayoutDecider = ({ children }) => {
  const pathName = usePathname();

  switch (pathName) {
    case "/sign-in":
    case "/sign-up":
      return (
        <div className="h-[100vh] w-full flex justify-center items-center">
          {children}
        </div>
      );
    default:
      return <RecruitRightAppLayout>{children}</RecruitRightAppLayout>;
  }
};

export default LayoutDecider;
