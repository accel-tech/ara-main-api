import Joi from "joi";

export const validateEditTask = (data: unknown) => {
  const schema = Joi.object<{
    text?: string;
  }>({
    text: Joi.string().optional()
  });
  return schema.validateAsync(data);
};
