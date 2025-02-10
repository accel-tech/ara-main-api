import Joi from "joi";

export const validateAddCertification = (data: unknown) => {
  const schema = Joi.object<{ certificationId: string }>({
    certificationId: Joi.string().required()
  });

  return schema.validateAsync(data);
};
