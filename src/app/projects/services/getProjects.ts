import { Filter, FindOptions } from "mongodb";
import { IReport, Report } from "../../../config/types/report";
import { reqUser } from "../../../config/types/request";
import { processProjectFilters } from "../utils/processing";
import { IProject, Project } from "../../../config/types/project";

export const getProjects = async (
  filter: Filter<IProject> = {},
  options: FindOptions = {},
  user: reqUser
) => {
  const reports = await Project.find(processProjectFilters(filter, user), options);

  return reports;
};
