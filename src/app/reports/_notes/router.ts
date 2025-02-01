import { Router } from "express";
import { parseBody } from "../../../config/middlewares/parseBody";
import { ReportNotesHandler } from "./handler";

const router = Router();

router.post("/", parseBody, ReportNotesHandler.addNote);
router.patch("/:noteId", parseBody, ReportNotesHandler.editNote);
router.delete("/:noteId", ReportNotesHandler.deleteNote);

export default router;
