import Joi from "joi";

export const validateAddProject = (data: unknown) => {
  const schema = Joi.object<{
    title: string;
    description: string;
    overseerId: string;
    departmentId: string;
  }>({
    title: Joi.string().trim().lowercase().required(),
    description: Joi.string().required(),
    overseerId: Joi.string().required(),
    departmentId: Joi.string().required()
  });
  return schema.validateAsync(data);
};
