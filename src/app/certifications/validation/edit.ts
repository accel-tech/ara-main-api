import Joi from "joi";

export const validateEditCertification = (data: unknown, currentStatus: string) => {
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
      then: Joi.required(),
      otherwise: currentStatus === "projected" ? Joi.optional() : Joi.forbidden()
    }),
    dateCompleted: Joi.date().when("status", {
      is: "completed",
      then: Joi.required(),
      otherwise: currentStatus === "completed" ? Joi.optional() : Joi.forbidden()
    })
  });
  return schema.validateAsync(data);
};
