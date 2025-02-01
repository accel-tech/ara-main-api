import { handler } from "../../../config/types/request";
import { ensureValue } from "../../../config/utils/misc";
import { httpHandler } from "../../../config/http/httpHandler";
import assert from "assert";
import { editMetrics } from "./services";

export class ReportMetricsHandler {
  @httpHandler("Edit Report Metrics")
  static editMetrics: handler = async (req) => {
    assert(req.document?.kind === "report");
    return await editMetrics(ensureValue(req.document.object), ensureValue(req.body));
  };
}
