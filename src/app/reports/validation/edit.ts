import Joi from "joi";

export const validateEditReport = (data: unknown) => {
  const schema = Joi.object({}); // status?
  return schema.validateAsync(data);
};
