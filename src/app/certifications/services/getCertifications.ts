import { Filter, FindOptions } from "mongodb";

import { reqUser } from "../../../config/types/request";
import { processCertificationFilters } from "../utils/processing";
import { ICertification, Certification } from "../../../config/types/certification";

export const getCertifications = async (
  filter: Filter<ICertification> = {},
  options: FindOptions = {},
  user: reqUser
) => {
  const certifications = await Certification.find(
    processCertificationFilters(filter, user),
    options
  );

  return certifications;
};
