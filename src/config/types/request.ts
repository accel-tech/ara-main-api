import { NextFunction, Request, Response } from "express";
import { ClientSession, FilterQuery, QueryOptions } from "mongoose";
import { Filter, FindOptions } from "mongodb";
import { IUser } from "./user";
import { IReport } from "./report";
import { ICertification } from "./certification";
import { IProject } from "./project";
import { ITask } from "./task";
import { IMetric } from "./metrics";

export interface xRequest extends Request {
  purpose?: string;
  user?: reqUser;
  document?:
    | { kind: "report"; object: IReport }
    | { kind: "certification"; object: ICertification }
    | { kind: "project"; object: IProject }
    | { kind: "task"; object: ITask }
    | { kind: "metric"; object: IMetric };
  session?: ClientSession;
  qOptions?: FindOptions;
  qFilter?: Filter<any>;
  projectId?: string;
}

export type reqUser =
  | Pick<IUser & { role: "admin" }, "_id" | "name" | "email" | "role">
  | Pick<IUser & { role: "basic" }, "_id" | "name" | "email" | "role" | "departmentAccess">;

export type xRequestHandler = (
  req: xRequest,
  res: Response,
  next: NextFunction
) => any | Promise<any>;

export type handler = (req: xRequest) => Promise<object> | object;

export type ServiceResponse<T> =
  | { success: true; data: T; error: undefined }
  | { success: false; data: undefined; error: object };
