import { ClientSession, UpdateFilter } from "mongodb";
import { IReport, Report } from "../../../config/types/report";
import { validateEditReport } from "../validation/edit";
import { updateMetricStatus } from "../utils";

export const editReport = async (report: IReport, data: unknown, session: ClientSession) => {
  const fields = await validateEditReport(data, report.status);
  const patchData: UpdateFilter<IReport> = { $set: {}, $unset: {} };

  if (fields.status && fields.status !== report.status) {
    if (fields.status === "draft") {
      patchData.$set = { ...patchData.$set, status: fields.status };
      patchData.$unset = { ...patchData.$unset, datePublished: 1 };
      await updateMetricStatus(report.metrics._id, "draft", session);
    }
    if (fields.status === "published") {
      patchData.$set = { ...patchData.$set, status: fields.status, datePublished: new Date() };
      await updateMetricStatus(report.metrics._id, "draft", session);
    }
  }

  if (!Object.keys(patchData.$set!).length && !Object.keys(patchData.$unset!).length) {
    return report;
  }

  const res = await Report.updateOne({ _id: report._id }, patchData, { session });

  if (res.matchedCount !== 1 || res.modifiedCount !== res.matchedCount) {
    throw new Error("Failed to edit report");
  }
  // no changes
  return report;
};
