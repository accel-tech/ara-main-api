import { Filter, FindOptions } from "mongodb";
import { IReport, Report } from "../../../config/types/report";
import { reqUser } from "../../../config/types/request";
import { processReportFilters } from "../utils/processing";
import { Task } from "../../../config/types/task";
import { Metric } from "../../../config/types/metrics";

export const getReports = async (
  filter: Filter<IReport> = {},
  options: FindOptions = {},
  user: reqUser,
  extraOptions?: {
    populateProjectTasks?: boolean;
    populateMetrics?: boolean;
  }
) => {
  let reports = await Report.find(processReportFilters(filter, user), options);

  if (extraOptions?.populateProjectTasks) {
    const tasks = await Task.find({ "report._id": { $in: reports.map((rep) => rep._id) } });
    reports = reports.map((rep) => ({
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

  if (extraOptions?.populateMetrics) {
    const metrics = await Metric.find({ "report._id": { $in: reports.map((rep) => rep._id) } });

    reports = reports.map((rep) => ({
      ...rep,
      metrics: {
        _id: rep.metrics._id,
        data: metrics.find((met) => met.report._id.toString() === rep._id.toString())?.data
      }
    }));
  }

  return reports;
};
