import { handler } from "../../../config/types/request";
import { ensureValue } from "../../../config/utils/misc";
import { httpHandler } from "../../../config/http/httpHandler";
import assert from "assert";
import { deleteTask } from "../services/deleteTask";
import { addTask } from "../services/addTask";
import { editTask } from "../services/editTask";

export class TasksHandler {
  @httpHandler("Add Task")
  static addTask: handler = async (req) => {
    return await addTask(ensureValue(req.body), ensureValue(req.user));
  };

  @httpHandler("Edit Task")
  static editTask: handler = async (req) => {
    assert(req.document?.kind === "task");
    return await editTask(ensureValue(req.document.object), ensureValue(req.body));
  };

  @httpHandler("Delete Task")
  static deleteTask: handler = async (req) => {
    assert(req.document?.kind === "task");
    return await deleteTask(ensureValue(req.document.object));
  };
}
