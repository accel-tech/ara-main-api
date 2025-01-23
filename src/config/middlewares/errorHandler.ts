import { NextFunction, Response } from "express";
import ClientError from "../errors/ClientError";
import PermissionError from "../errors/PermissionError";
import HttpFail from "../http/HttpFail";
import { xRequest } from "../types/request";
import NotFoundError from "../errors/NotFoundError";
import Joi from "joi";

export const errorHandler = async (
  error: ClientError | PermissionError | NotFoundError,
  req: xRequest,
  res: Response,
  next: NextFunction
) => {
  let status = 500;
  let message = `Failed to ${req.purpose || "Process Request"}`;
  let type = "InternalError";
  let fields: string[] = [];
  let translations: { [key: string]: any } = {};
  let details: { [key: string]: any } = { message: error.message };

  if (error.type === "ClientError") {
    status = 400;
    type = error.type;
    message = error.message;
    fields = error.fields;
    translations = error.translation;
    details = error.details;
  }

  if (error instanceof Joi.ValidationError) {
    status = 400;
    type = "ClientError";
    message = error.message;
    fields = error.details.map((dt) => `${dt.path}`);
  }

  if (error.type === "PermissionError") {
    status = error.status;
    type = error.type;
    message = error.message;
    translations = error.translation;
  }

  if (error.type === "NotFoundError") {
    status = 404;
    type = error.type;
    message = error.message;
    translations = error.translation;
  }

  const resp = new HttpFail(message, type, status, fields, details, translations);
  res.status(resp.status).json(resp.payload);

  if (status === 500) {
    console.log(error);
  }

  await req.session?.abortTransaction();
  req.session?.endSession();
};
