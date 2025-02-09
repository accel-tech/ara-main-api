import { Filter, FindOptions } from "mongodb";
import { IReport, Report } from "../../../config/types/report";
import { reqUser } from "../../../config/types/request";
import { processReportFilters } from "../utils/processing";
import { Task } from "../../../config/types/task";

export const getReports = async (
  filter: Filter<IReport> = {},
  options: FindOptions = {},
  user: reqUser,
  populateProjectTasks?: boolean
) => {
  const reports = await Report.find(processReportFilters(filter, user), options);
  if (populateProjectTasks) {
    const tasks = await Task.find({ "report._id": { $in: reports.map((rep) => rep._id) } });
    return reports.map((rep) => ({
      ...rep,
      projects: rep.projects.map((pro) => ({
        ...pro,
        tasks: tasks.filter(
          (task) =>
            task.report._id.toString() === rep._id.toString() &&
            task.project._id.toString() === pro._id.toString()
        )
      }))
    }));
  }

  return reports;
};
