import { getAccountDetails } from "@/lib/getAccountDetails";
import MyApplications from "./components/MyApplications";
import { ACCOUNT_TYPE } from "@/constants/accountTypes";
import { notFound } from "next/navigation";
import HeaderSetter from "../components/HeaderSetter";

const Applications = async () => {
  const { account_id, type } = await getAccountDetails();
  const isJobSeeker = type === ACCOUNT_TYPE.JOB_SEEKER;
  if (!isJobSeeker) {
    return notFound();
  }
  return (
    <>
      <HeaderSetter text={"My applications"} />
      <MyApplications accountId={account_id} />
    </>
  );
};

export default Applications;
