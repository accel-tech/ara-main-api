import Joi from "joi";

export const validateEditProject = (data: unknown) => {
  const schema = Joi.object<{
    title?: string;
    description?: string;
    overseerId?: string;
    isActive?: boolean;
  }>({
    title: Joi.string(),
    description: Joi.string(),
    overseerId: Joi.string(),
    isActive: Joi.boolean()
  });
  return schema.validateAsync(data);
};
