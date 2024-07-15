"use client";
import { useEffect } from "react";
import { useHeaderContext } from "../Header";

const HeaderSetter = ({ text }) => {
  const { setLabel } = useHeaderContext();
  useEffect(() => {
    setLabel(text);
  }, [text]);
  return null;
};

export default HeaderSetter;
