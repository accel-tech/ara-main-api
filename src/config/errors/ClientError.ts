/**
 * Client Error
 */
export default class ClientError extends Error {
  message: string;
  fields: string[];
  translation: { [lang: string]: string };
  type: "ClientError";
  details: { [key: string]: string };
  constructor(
    message: string,
    fields?: string[],
    translations?: { [key: string]: string },
    details?: { [key: string]: string },
    ...params: any
  ) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ClientError);
    }

    this.type = "ClientError";
    this.message = message;
    this.fields = fields || [];
    this.translation = translations || {};
    this.details = details || {};
  }
}
