export enum SUBMISSION_STATUS {
  IN_PROGRESS = "in-progress",
  EVALUATION_PENDING = "evaluation-pending",
  SUBMITTED = "submitted",
  HIRING_MANAGER_VIEWED = "hiring-manager-viewed",
  HIRING_MANAGER_REACHOUT = "hiring-manager-reachout",
  SELECTED = "selected",
  REJECTED = "rejected",
}

export const SUBMISSION_STATUS_TAG_MAPPING = {
  [SUBMISSION_STATUS.IN_PROGRESS]: "geekblue",
  [SUBMISSION_STATUS.EVALUATION_PENDING]: "volcano",
  [SUBMISSION_STATUS.SUBMITTED]: "green",
  [SUBMISSION_STATUS.HIRING_MANAGER_VIEWED]: "geekblue",
  [SUBMISSION_STATUS.HIRING_MANAGER_REACHOUT]: "volcano",
  [SUBMISSION_STATUS.SELECTED]: "green",
  [SUBMISSION_STATUS.REJECTED]: "red",
};
