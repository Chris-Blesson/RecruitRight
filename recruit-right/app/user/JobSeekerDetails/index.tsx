"use client";
import { Tabs } from "antd";
import BasicInformation from "./BasicInformation";
import Projects from "./Projects";
import Work from "./Work";
import Skills from "./Skills";
import Education from "./Education";
import Resume from "./Resume";
import { useEffect } from "react";
import HeaderSetter from "@/app/components/HeaderSetter";

const JobSeekerDetails = () => {
  const tabItems = [
    {
      label: "Basic Information",
      key: "BasicInformation",
      children: <BasicInformation />,
    },
    {
      label: "Work Experience",
      key: "WorkExperience",
      children: <Work />,
    },
    {
      label: "Projects",
      key: "Projects",
      children: <Projects />,
    },
    {
      label: "Skills",
      key: "Skills",
      children: <Skills />,
    },
    {
      label: "Education",
      key: "Education",
      children: <Education />,
    },
    {
      label: "Resume",
      key: "Resume",
      children: <Resume />,
    },
  ];
  // useEffect(() => {
  //   window.location.reload();
  // }, []);
  return (
    <>
      <HeaderSetter text={"My profile"} />
      <Tabs
        tabPosition={"left"}
        items={tabItems.map((tabItem) => {
          return {
            ...tabItem,
          };
        })}
      />
    </>
  );
};

export default JobSeekerDetails;
