/**
 * Permission Error
 */
export default class PermissionError extends Error {
  message: string;
  status: number;
  translation: { [lang: string]: string };
  type: "PermissionError";
  constructor(
    message: string,
    status?: number,
    translations?: { [key: string]: string },
    ...params: any
  ) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PermissionError);
    }

    this.type = "PermissionError";
    this.message = message;
    this.status = status || 401;
    this.translation = translations || {};
  }
}
