import { handler } from "../../../config/types/request";
import { ensureValue } from "../../../config/utils/misc";
import { httpHandler } from "../../../config/http/httpHandler";
import assert from "assert";
import { getMetrics } from "../services/getMetrics";
import { editMetric } from "../services/editMetric";
import { ObjectId } from "mongodb";

export class MetricHandler {
  @httpHandler("Get Metric")
  static getMetric: handler = async (req) => {
    return await getMetrics(
      { ...req.qFilter, _id: new ObjectId(ensureValue(req.params.id)) },
      req.qOptions,
      ensureValue(req.user)
    );
  };
  @httpHandler("Get Metrics")
  static getMetrics: handler = async (req) => {
    return await getMetrics(req.qFilter, req.qOptions, ensureValue(req.user));
  };

  @httpHandler("Edit Metric", 202)
  static editMetric: handler = async (req) => {
    assert(req.document?.kind === "metric");
    return await editMetric(ensureValue(req.document.object), ensureValue(req.body));
  };
}
