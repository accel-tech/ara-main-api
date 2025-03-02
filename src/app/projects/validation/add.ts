import Joi from "joi";

export const validateAddProject = (data: unknown) => {
  const schema = Joi.object<{
    title: string;
    description: string;
    overseerId: string;
    departmentId: string;
    writePolicy: "overseerOnly" | "allDepartment";
  }>({
    title: Joi.string().trim().lowercase().required(),
    description: Joi.string().required(),
    overseerId: Joi.string().required(),
    departmentId: Joi.string().required(),
    writePolicy: Joi.string().valid("overseerOnly", "allDepartment").default("overseerOnly")
  });
  return schema.validateAsync(data);
};
