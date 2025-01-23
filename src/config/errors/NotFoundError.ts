/**
 * NotFound Error
 */
export default class NotFoundError extends Error {
  message: string;
  translation: { [lang: string]: string };
  type: "NotFoundError";
  constructor(message: string, translations?: { [key: string]: string }, ...params: any) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NotFoundError);
    }

    this.type = "NotFoundError";
    this.message = message;
    this.translation = translations || {};
  }
}
