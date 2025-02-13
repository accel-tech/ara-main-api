import Joi from "joi";

export const validateCreateReport = (data: unknown) => {
  const schema = Joi.object<{
    departmentId: string;
    title: string;
    coveringDates: { from: Date; to: Date };
    options?: {
      autoPopulateProjects?: boolean;
      autoPopulateCertifications?: boolean;
      autoPopulateMetrics?: boolean;
      ignoreDateConflicts?: boolean;
    };
  }>({
    departmentId: Joi.string().required(),
    title: Joi.string().required(),
    coveringDates: Joi.object({
      from: Joi.date().required(),
      to: Joi.date().required()
    }).required(),
    options: Joi.object({
      autoPopulateProjects: Joi.boolean(),
      autoPopulateCertifications: Joi.boolean(),
      autoPopulateMetrics: Joi.boolean(),
      ignoreDateConflicts: Joi.boolean()
    })
  });

  return schema.validateAsync(data);
};
