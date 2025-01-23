/**
 * Creates Formatted HTTP Success Response Object
 */
export default class HttpSuccess {
  purpose: string;
  status: number;
  payload: { success: true; data: object };

  constructor(data: object, purpose: string, status: number = 200) {
    this.purpose = purpose; // for logging;
    this.status = status;
    this.payload = {
      success: true,
      data
    };
  }
}
