import { getAccountDetails } from "@/lib/getAccountDetails";
import MyApplications from "./components/MyApplications";

const Applications = async () => {
  const { account_id } = await getAccountDetails();
  return <MyApplications accountId={account_id} />;
};

export default Applications;
