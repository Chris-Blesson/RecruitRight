interface IBasicInfo {
  name: string;
  email: string;
  phone: string;
  website: string;
  address: string;
}

interface IEducation {
  institution: string;
  area: string;
  additionalAreas: string[];
  studyType: string;
  startDate: string;
  endDate: string;
  score: string;
  location: string;
}

interface IAward {
  title: string;
  date: string;
  awarder: string;
  summary: string;
}

interface IProject {
  name: string;
  description: string;
  keywords: string[];
  url: string;
}

interface ISkill {
  name: string;
  keywords: string[];
}

interface IWorkExperience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  location: string;
  highlights: string[];
}

export interface IResumeData {
  basics: IBasicInfo;
  education: IEducation[];
  awards: IAward[];
  projects: IProject[];
  skills: ISkill[];
  work: IWorkExperience[];
}
