import { json } from "express";
import { xRequestHandler } from "../types/request";

export const parseBody: xRequestHandler = (req, res, next) => {
  const func = json();
  func(req, res, next);
  try {
  } catch (err) {}
};
