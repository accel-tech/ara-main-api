import { reqUser } from "../../../config/types/request";
import { Task } from "../../../config/types/task";
import { validateProjectTaskWritable, validateReportTaskWritable } from "../utils";
import { validateAddTask } from "../validation/add";
import assert from "assert";

export const addTask = async (data: unknown, user: reqUser) => {
  assert(user.role === "basic");
  const fields = await validateAddTask(data);

  const { department, ...report } = await validateReportTaskWritable({
    reportId: fields.reportId,
    projectId: fields.projectId,
    departmentAccess: user.departmentAccess
  });

  const project = await validateProjectTaskWritable({
    projectId: fields.projectId,
    userId: user._id,
    departmentAccess: user.departmentAccess
  });

  const task = await Task.create({
    text: fields.text,
    kind: fields.kind,
    dateAdded: new Date(),
    addedBy: { _id: user._id, name: user.name, email: user.email },
    report: report,
    department: department,
    project
  });

  return task;
};
