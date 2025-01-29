import Joi from "joi";

export const validateCreateDepartment = (data: any) => {
  const schema = Joi.object<{
    title: string;
    category: "technical";
    reportKind: "r&d";
  }>({
    title: Joi.string().required(),
    category: Joi.string().required().valid("technical"),
    reportKind: Joi.string().required().valid("r&d")
  });

  return schema.validateAsync(data);
};
