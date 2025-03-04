import Joi from "joi";
import { IMetric } from "../../../config/types/metrics";

export const validateEditMetric = (kind: IMetric["kind"], data: unknown) => {
  if (kind !== "r&d") throw new Error(`Unexpected metric kind '${kind}'`);

  const schema = Joi.object<Partial<IMetric["data"]>>({
    origins_cpu_used: Joi.number(),
    origins_cpu_available: Joi.number(),
    origins_memory_used: Joi.number(),
    origins_memory_available: Joi.number(),
    origins_ceph_used: Joi.number(),
    origins_ceph_available: Joi.number(),
    origins_pods: Joi.number(),
    origins_vms: Joi.number(),
    origins_downtime: Joi.number(),
    origins_outages: Joi.number(),
    origins_mean_recovery_time: Joi.number(),
    origins_node_status: Joi.string(),
    origins_api_latency_internal: Joi.number(),
    origins_ingress_latency_internal: Joi.number(),
    origins_api_latency_external: Joi.number(),
    origins_ingress_latency_external: Joi.number(),
    //
    originsl1_cpu_used: Joi.number(),
    originsl1_cpu_available: Joi.number(),
    originsl1_memory_used: Joi.number(),
    originsl1_memory_available: Joi.number(),
    originsl1_flashsystem_used: Joi.number(),
    originsl1_flashsystem_available: Joi.number(),
    originsl1_pods: Joi.number(),
    originsl1_downtime: Joi.number(),
    originsl1_outages: Joi.number(),
    originsl1_mean_recovery_time: Joi.number(),
    originsl1_node_status: Joi.string(),
    originsl1_api_latency_internal: Joi.number(),
    originsl1_ingress_latency_internal: Joi.number(),
    originsl1_api_latency_external: Joi.number(),
    originsl1_ingress_latency_external: Joi.number(),
    //
    ocp_cpu_used: Joi.number(),
    ocp_cpu_available: Joi.number(),
    ocp_memory_used: Joi.number(),
    ocp_memory_available: Joi.number(),
    ocp_ceph_used: Joi.number(),
    ocp_ceph_available: Joi.number(),
    ocp_pods: Joi.number(),
    ocp_vms: Joi.number(),
    //
    ceph_storage_used: Joi.number(),
    ceph_storage_available: Joi.number(),
    //
    flashsystem_storage_used: Joi.number(),
    flashsystem_storage_available: Joi.number()
  });
  return schema.validateAsync(data);
};
