import { httpHandler } from "../../../config/http/httpHandler";
import { handler } from "../../../config/types/request";
import { ensureValue } from "../../../config/utils/misc";

export class AuthHandlers {
  @httpHandler("Get Auth State", 200)
  static getAuth: handler = (req) => {
    return ensureValue(req.user);
  };
}
