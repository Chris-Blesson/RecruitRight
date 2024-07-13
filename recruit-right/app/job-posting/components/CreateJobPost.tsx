import CreateJobForm from "./Forms/CreateJobForm";
import TemplatesPanel from "./TemplatesPanel";

const CreateJobPost = () => {
  return (
    <div className="create-job-post-layout m-6  bg-white flex-1 rounded-lg shadow-lg">
      <div className="p-4">
        <div className="flex justify-between">
          <div
            className="form-container flex relative flex-col flex-1 after:content-['&nbsp;'] after:h-full after:border  after:absolute
        after:border-current after:right-[5%] after:border-brown-600"
          >
            <h1 className="text-lg font-bold">Create Job Posting</h1>
            <CreateJobForm />
          </div>
          <div className="templates-section flex flex-col flex-1 max-w-[375px] w-full">
            <h2 className="text-lg font-bold">Templates</h2>
            <TemplatesPanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateJobPost;
