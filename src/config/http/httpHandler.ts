import { Response } from "express";
import { xRequest } from "../types/request";
import HttpSuccess from "./HttpSuccess";

export function httpHandler(purpose: string, statusCode: number = 200): PropertyDecorator {
  return function (target: any, propertyKey: symbol | string): void {
    const descriptor = Object.getOwnPropertyDescriptor(target, propertyKey);

    if (descriptor === undefined) {
      throw new Error(`Descriptor is undefined for property ${String(propertyKey)}`);
    }

    const originalMethod = descriptor.value;

    descriptor.value = async function (req: xRequest, res: Response) {
      const result = await originalMethod.apply(this, [req, res]);
      const successResponse = new HttpSuccess(result, purpose, statusCode);
      res.status(successResponse.status).json(successResponse.payload);

      await req.session?.commitTransaction();
      req.session?.endSession();
    };

    Object.defineProperty(target, propertyKey, descriptor);
  };
}

export function rawHttpHandler(purpose: string, statusCode: number = 200): PropertyDecorator {
  return function (target: any, propertyKey: symbol | string): void {
    const descriptor = Object.getOwnPropertyDescriptor(target, propertyKey);

    if (descriptor === undefined) {
      throw new Error(`Descriptor is undefined for property ${String(propertyKey)}`);
    }

    const originalMethod = descriptor.value;

    descriptor.value = async function (req: xRequest, res: Response) {
      const result = await originalMethod.apply(this, [req, res]);
      const successResponse = new HttpSuccess({}, purpose, statusCode);
      res.status(successResponse.status).send(result);

      await req.session?.commitTransaction();
      req.session?.endSession();
    };

    Object.defineProperty(target, propertyKey, descriptor);
  };
}
