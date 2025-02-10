import { ObjectId } from "mongodb";
import { reqUser } from "../../../config/types/request";
import { IReport, Report } from "../../../config/types/report";
import { validateAddNote, validateEditNote } from "./validation";
import ClientError from "../../../config/errors/ClientError";
import PermissionError from "../../../config/errors/PermissionError";
import assert from "assert";

export const addNote = async (report: IReport, data: unknown, user: reqUser) => {
  if (report.status !== "draft") {
    throw new ClientError(`Can no longer edit report that is '${report.status}'`);
  }
  const fields = await validateAddNote(data);

  const note = {
    _id: new ObjectId(),
    text: fields.text,
    addedBy: { _id: user._id, name: user.name, email: user.email },
    dateAdded: new Date()
  };

  const res = await Report.updateOne({ _id: report._id }, { $push: { notes: note } });

  if (res.matchedCount !== 1 || res.modifiedCount !== res.matchedCount) {
    throw new Error("Failed to add note");
  }

  return note;
};

export const editNote = async (report: IReport, noteId: string, data: unknown, user: reqUser) => {
  if (report.status !== "draft") {
    throw new ClientError(`Can no longer edit report that is '${report.status}'`);
  }
  const originalNote = report.notes.find((note) => note._id.toString() === noteId);
  if (!originalNote) throw new ClientError(`Note '${noteId}' not found`);

  if (originalNote.addedBy._id.toString() !== user._id.toString()) {
    throw new PermissionError("Only the author can edit this note");
  }

  const fields = await validateEditNote(data);

  const res = await Report.updateOne(
    { _id: report._id },
    { $set: { "notes.$[element].text": fields.text } },
    { arrayFilters: [{ "element._id": originalNote._id }] }
  );

  if (res.matchedCount !== 1 || res.modifiedCount !== res.matchedCount) {
    throw new Error("Failed to edit note");
  }

  return { ...originalNote, text: fields.text };
};

export const deleteNote = async (report: IReport, noteId: string, user: reqUser) => {
  if (report.status !== "draft") {
    throw new ClientError(`Can no longer edit report that is '${report.status}'`);
  }
  const note = report.notes.find((note) => note._id.toString() === noteId);
  if (!note) throw new ClientError(`Note '${noteId}' not found`);

  assert(user.role === "basic");

  const isLead = user.departmentAccess.some(
    (dep) => dep._id.toString() === report.department._id.toString() && dep.access === "lead"
  );

  if (note.addedBy._id.toString() !== user._id.toString() && !isLead) {
    throw new PermissionError("You cannot delete this note");
  }

  const res = await Report.updateOne({ _id: report._id }, { $pull: { notes: { _id: note._id } } });

  if (res.matchedCount !== 1 || res.modifiedCount !== res.matchedCount) {
    throw new Error("Failed to delete note");
  }

  return noteId;
};
