import { IMetric, Metric } from "../../../config/types/metrics";
import { validateEditMetric } from "../validation/edit";
import ClientError from "../../../config/errors/ClientError";

export const editMetric = async (metric: IMetric, data: unknown) => {
  if (metric.datePublished) {
    throw new ClientError(`Cannot edit metric that has already been published`);
  }

  const fields = await validateEditMetric(metric.kind, data);

  const newData = { ...metric.data, ...fields }; // revalidate?

  const res = await Metric.updateOne({ _id: metric._id }, { $set: { data: newData } });

  if (res.matchedCount !== 1 || res.modifiedCount !== res.matchedCount) {
    throw new Error("Failed to edit metrics");
  }

  return fields;
};
