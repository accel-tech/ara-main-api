import Joi from "joi";
import { IReport } from "../../../config/types/report";

export const validateEditMetrics = (data: unknown) => {
  const schema = Joi.object<Partial<IReport["metrics"]>>({
    origins_cpu: Joi.number(),
    origins_memory: Joi.number()
  });
  return schema.validateAsync(data);
};
