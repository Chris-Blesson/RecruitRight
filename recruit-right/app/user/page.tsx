import { getAccountDetails } from "@/lib/getAccountDetails";
import JobSeekerDetails from "./JobSeekerDetails";
import { ACCOUNT_TYPE } from "@/constants/accountTypes";

const UserDetails = async () => {
  //TODO: Take the user type from auth
  const account = await getAccountDetails();
  console.log("account", account);

  if (account?.type === ACCOUNT_TYPE.RECRUITER) {
    return (
      <div>
        <div className="mb-3">
          <h3 className="text-lg font-bold">Name</h3>
          <p>{account.name}</p>
        </div>
        <div className="mb-3">
          <h3 className="text-lg font-bold">Email</h3>
          <p>{account.email}</p>
        </div>
        <div className="mb-3">
          <h3 className="text-lg font-bold">Organisation</h3>
          <p>{account.organisation}</p>
        </div>
      </div>
    );
  }
  return (
    <div>
      <JobSeekerDetails />
    </div>
  );
};

export default UserDetails;
