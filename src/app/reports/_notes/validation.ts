import Joi from "joi";

export const validateAddNote = (data: unknown) => {
  const schema = Joi.object<{ text: string }>({ text: Joi.string().required() });
  return schema.validateAsync(data);
};

export const validateEditNote = (data: unknown) => {
  const schema = Joi.object<{ text: string }>({ text: Joi.string().required() });
  return schema.validateAsync(data);
};
