import Joi from "joi";

export const validateAddCertification = (data: unknown, isLead: boolean) => {
  const schema = Joi.object<{
    title: string;
    examCode?: string;
    examLink?: string;
    employee?: { _id: string };
    status: "projected" | "completed";
    dateProjected?: Date;
    dateCompleted?: Date;
  }>({
    title: Joi.string().required(),
    examCode: Joi.string(),
    examLink: Joi.string(),
    employee: !isLead ? Joi.forbidden() : Joi.object({ _id: Joi.string().required() }).required(),
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

export const validateEditCertification = (data: unknown) => {
  const schema = Joi.object<{
    title?: string;
    examCode?: string;
    examLink?: string;
    status?: "projected" | "completed";
    dateProjected?: Date;
    dateCompleted?: Date;
  }>({
    title: Joi.string(),
    examCode: Joi.string(),
    examLink: Joi.string(),
    status: Joi.string().valid("projected", "completed"),
    dateProjected: Joi.date().when("status", {
      is: "projected",
      then: Joi.optional(),
      otherwise: Joi.forbidden()
    }),
    dateCompleted: Joi.date().when("status", {
      is: "completed",
      then: Joi.optional(),
      otherwise: Joi.forbidden()
    })
  });
  return schema.validateAsync(data);
};
