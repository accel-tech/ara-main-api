import { handler } from "../../../config/types/request";
import { ensureValue } from "../../../config/utils/misc";
import { httpHandler } from "../../../config/http/httpHandler";
import { addNote, deleteNote, editNote } from "./services";
import assert from "assert";

export class ReportNotesHandler {
  @httpHandler("Add Report Note")
  static addNote: handler = async (req) => {
    assert(req.document?.kind === "report");
    return await addNote(
      ensureValue(req.document.object),
      ensureValue(req.body),
      ensureValue(req.user)
    );
  };

  @httpHandler("Edit Report Note")
  static editNote: handler = async (req) => {
    assert(req.document?.kind === "report");
    return await editNote(
      ensureValue(req.document.object),
      ensureValue(req.params.noteId),
      ensureValue(req.body),
      ensureValue(req.user)
    );
  };

  @httpHandler("Delete Report Note")
  static deleteNote: handler = async (req) => {
    assert(req.document?.kind === "report");
    return await deleteNote(
      ensureValue(req.document.object),
      ensureValue(req.params.noteId),
      ensureValue(req.user)
    );
  };
}
