import { IReport, Report } from "../../../config/types/report";
import { validateEditMetrics } from "./validation";
import ClientError from "../../../config/errors/ClientError";

export const editMetrics = async (report: IReport, data: unknown) => {
  if (report.status !== "draft") {
    throw new ClientError(`Can no longer edit report that is '${report.status}'`);
  }

  const fields = await validateEditMetrics(data);

  const newMetrics = { ...report.metrics, ...fields }; // revalidate?

  const res = await Report.updateOne({ _id: report._id }, { $set: { metrics: newMetrics } });

  if (res.matchedCount !== 1 || res.modifiedCount !== res.matchedCount) {
    throw new Error("Failed to edit metrics");
  }

  return fields;
};
