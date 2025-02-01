import PermissionError from "../../../config/errors/PermissionError";
import { xRequestHandler } from "../../../config/types/request";
import { ensureValue } from "../../../config/utils/misc";
import assert from "assert";

// export const requiresNoteAuthor: xRequestHandler = (req, res, next) => {
//   const user = ensureValue(req.user);
//   assert(user.role === "basic");

//   const document = ensureValue(req.document);
//   assert(document.kind === "report");

//   const noteId = ensureValue(req.params.noteId);

//   if (user.role === "basic") {
//     const isAuthor = document.object.notes.some(
//       (note) =>
//         note._id.toString() === noteId && note.addedBy._id.toString() === user._id.toString()
//     );
//     if (isAuthor) return next();
//   }

//   throw new PermissionError("You are not authorized to access this resource.", 403);
// };
