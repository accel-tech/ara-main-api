import Joi from "joi";

export const validateAddProject = (data: unknown) => {
  const schema = Joi.object<{ projectId: string }>({ projectId: Joi.string().required() });
  return schema.validateAsync(data);
};
