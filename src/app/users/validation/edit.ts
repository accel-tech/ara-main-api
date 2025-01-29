import Joi from "joi";

export const validateEditUser = (data: any) => {
  const schema = Joi.object<{
    departmentAccess?: {
      _id: string;
      title?: string;
      category?: string;
      access: "member" | "lead";
    }[];
  }>({
    departmentAccess: Joi.array().items(
      Joi.object({
        _id: Joi.string().required(),
        title: Joi.string(),
        category: Joi.string(),
        access: Joi.string().required().valid("member", "lead", "supervisor")
      })
    )
  });

  return schema.validateAsync(data);
};
