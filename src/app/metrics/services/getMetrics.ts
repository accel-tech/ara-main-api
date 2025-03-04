import { Filter, FindOptions } from "mongodb";
import { reqUser } from "../../../config/types/request";
import { IMetric, Metric } from "../../../config/types/metrics";
import { processMetricFilters } from "../utils/processing";

export const getMetrics = async (
  filter: Filter<IMetric> = {},
  options: FindOptions = {},
  user: reqUser
) => {
  const metrics = await Metric.find(processMetricFilters(filter, user), options);

  return metrics;
};
