import Joi from "joi";

export const validateAddCertification = (data: unknown) => {
  const schema = Joi.object<{
    title: string;
    examCode?: string;
    examLink?: string;
    employeeId?: string;
    departmentId: string;
    status: "projected" | "completed";
    dateProjected?: Date;
    dateCompleted?: Date;
  }>({
    title: Joi.string().required(),
    examCode: Joi.string(),
    examLink: Joi.string(),
    employeeId: Joi.string().optional(),
    departmentId: Joi.string().required(),
    status: Joi.string().required().valid("projected", "completed"),
    dateProjected: Joi.date().when("status", {
      is: "projected",
      then: Joi.required(),
      otherwise: Joi.forbidden()
    }),
    dateCompleted: Joi.date().when("status", {
      is: "completed",
      then: Joi.required(),
      otherwise: Joi.forbidden()
    })
  });
  return schema.validateAsync(data);
};
