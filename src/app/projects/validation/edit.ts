import Joi from "joi";

export const validateEditProject = (data: unknown) => {
  const schema = Joi.object<{
    title?: string;
    description?: string;
    overseerId?: string;
    isActive?: boolean;
    writePolicy?: "overseerOnly" | "allDepartment";
  }>({
    title: Joi.string(),
    description: Joi.string(),
    overseerId: Joi.string(),
    isActive: Joi.boolean(),
    writePolicy: Joi.string().valid("overseerOnly", "allDepartment")
  });
  return schema.validateAsync(data);
};
