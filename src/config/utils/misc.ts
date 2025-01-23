export const getCorsOptions = () => {
  return {};
};

export function ensureValue<T>(val?: T): T {
  if (!val) throw new Error("Misconfigured Route");
  return val as T;
}

export function parseJSON(data: any) {
  try {
    return JSON.parse(data);
  } catch (err) {
    return {};
  }
}
