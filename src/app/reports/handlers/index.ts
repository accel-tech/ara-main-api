import { ObjectId } from "mongodb";
import { handler } from "../../../config/types/request";
import { ensureValue } from "../../../config/utils/misc";
import NotFoundError from "../../../config/errors/NotFoundError";
import { httpHandler } from "../../../config/http/httpHandler";
import { getReports } from "../services/getReports";
import { findReport } from "../services/findReport";
import { createReport } from "../services/createReport";

export class ReportHandlers {
  @httpHandler("Get Reports")
  static getReports: handler = async (req) => {
    return await getReports(req.qFilter, req.qOptions, ensureValue(req.user));
  };

  @httpHandler("Get Report")
  static getReport: handler = async (req) => {
    const reports = await getReports(
      { _id: new ObjectId(ensureValue(req.params.id)) },
      { ...req.qOptions, limit: 1 },
      ensureValue(req.user)
    );

    if (!reports[0]) throw new NotFoundError(`Report ${req.params.id} not found`);

    return reports[0];
  };

  @httpHandler("Find Report")
  static findReport: handler = async (req) => {
    return await findReport(ensureValue(req.qFilter), ensureValue(req.user));
  };

  @httpHandler("Create Report")
  static createReport: handler = async (req) => {
    return await createReport(ensureValue(req.body), ensureValue(req.user));
  };
}
