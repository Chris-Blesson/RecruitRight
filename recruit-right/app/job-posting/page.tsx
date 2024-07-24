import HeaderSetter from "../components/HeaderSetter";
import CreateJobPost from "./components/CreateJobPost";

const JobPosting = () => {
  return (
    <>
      <HeaderSetter text={"Create Job"} />
      <div className="flex flex-col min-h-[calc(100vh-4px)]">
        <CreateJobPost />
      </div>
    </>
  );
};

export default JobPosting;
