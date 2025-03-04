import { IReport } from "../../../config/types/report";
import ClientError from "../../../config/errors/ClientError";
import { editMetric } from "../../metrics/services/editMetric";
import { Metric } from "../../../config/types/metrics";
import assert from "assert";

export const editMetrics = async (report: IReport, data: unknown) => {
  if (report.status !== "draft") {
    throw new ClientError(`Can no longer edit report that is '${report.status}'`);
  }

  const metric = await Metric.findOne({ _id: report.metrics._id });
  assert(!!metric);

  return await editMetric(metric, data);
};
