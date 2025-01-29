import Joi from "joi";

export const validateEditDepartment = (data: any) => {
  const schema = Joi.object<{
    title?: string;
    category?: "technical";
    reportKind?: "r&d";
  }>({
    title: Joi.string(),
    category: Joi.string().valid("technical"),
    reportKind: Joi.string().valid("r&d")
  });

  return schema.validateAsync(data);
};
