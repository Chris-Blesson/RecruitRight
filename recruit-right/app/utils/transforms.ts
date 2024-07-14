import { IResumeData } from "../interface/resume";

export const transformCandidatePayload = (payload: IResumeData) => {
  const userId = payload.basics.email;
  const userValues = {
    name: payload.basics.name,
    email: payload.basics.email,
    phone: payload.basics.phone,
    website: payload.basics.website,
    address: payload.basics.address,
    education: JSON.stringify(payload.education),
    awards: JSON.stringify(payload.awards),
    projects: JSON.stringify(payload.projects),
    skills: JSON.stringify(
      payload.skills.map((skill) => skill.keywords).flat()
    ),
    work: JSON.stringify(payload.work),
  };
  return { userId, userValues };
};

export const transformJobCreationPayload = (payload) => {
  const { contest_date, ...rest } = payload;
  const [start_date_time, end_date_time] = contest_date;

  return {
    start_date_time: start_date_time?.$d,
    end_date_time: end_date_time?.$d,
    ...rest,
  };
};
