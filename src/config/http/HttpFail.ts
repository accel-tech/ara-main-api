/**
 * Creates Formatted HTTP Fail Response Object
 */
export default class HttpFail {
  payload: {
    success: false;
    error: {
      message: string;
      type: string;
      fields?: string[];
      details?: object;
      translations?: { [key: string]: string };
    };
  };
  status: number;

  constructor(
    message: string,
    type: string,
    status: number,
    fields?: string[],
    details?: object,
    translations?: { [key: string]: string }
  ) {
    this.status = status;
    this.payload = {
      success: false,
      error: { message, type, fields, details, translations }
    };
  }
}
