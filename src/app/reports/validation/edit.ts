import Joi from "joi";
import { IReport } from "../../../config/types/report";

export const validateEditReport = (data: unknown, currentStatus: string) => {
  const schema = Joi.object<{ status: IReport["status"] }>({
    status: Joi.string()
      .required()
      .valid(currentStatus === "draft" ? "published" : "draft")
  });
  return schema.validateAsync(data);
};
