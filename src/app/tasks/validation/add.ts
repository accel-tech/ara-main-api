import Joi from "joi";
import { ITask } from "../../../config/types/task";

export const validateAddTask = (data: unknown) => {
  const schema = Joi.object<{
    text: string;
    reportId: string;
    projectId: string;
    kind: ITask["kind"];
  }>({
    text: Joi.string().required(),
    reportId: Joi.string().required(),
    projectId: Joi.string().required(),
    kind: Joi.string().required().valid("upcoming", "completed", "challenge", "standby")
  });
  return schema.validateAsync(data);
};
