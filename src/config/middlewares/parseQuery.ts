import { NextFunction } from "express";
import { xRequest, xRequestHandler } from "../types/request";
import { FindOptions } from "mongodb";

export const parseQuery: xRequestHandler = async (req, res, next) => {
  req.qOptions ??= {};
  req.qFilter ??= {};

  for (const key in req.query || {}) {
    if (key.startsWith("_") && key !== "_id") {
      const option = validQueryOptions[key];
      if (!option) continue;
      req.qOptions[option.option] = option.fmt(req.query[key]);
    } else {
      // sanitize ?
      req.qFilter[key] = normalizeQueryValue(req.query[key]);
    }
  }

  return next();
};

export const injectQueryParams = (customQuery: { [key: string]: any }) => {
  return function (req: xRequest, res: Response, next: NextFunction) {
    req.qOptions ??= {};
    req.qFilter ??= {};

    for (const key in customQuery) {
      if (key.startsWith("_") && key !== "_id") {
        const option = validQueryOptions[key];
        if (!option) continue;
        req.qOptions[option.option] = option.fmt(customQuery[key]);
      } else {
        // sanitize ?
        req.qFilter[key] = customQuery[key];
      }
    }

    return next();
  };
};

const validQueryOptions: {
  [key: string]: { option: keyof FindOptions; fmt: (arg?: any) => any };
} = {
  _limit: { option: "limit", fmt: (val) => Number(val) ?? undefined },
  _show: { option: "projection", fmt: (val) => val },
  _skip: { option: "skip", fmt: (val) => Number(val) ?? undefined },
  _sort: { option: "sort", fmt: formatSort }
  // "populate",
  // "lean",
  // omitUndefined
  // rawResult
  // runValidators
  // sanitizeProjection
};

function formatSort(val: string) {
  const obj: { [key: string]: number } = {};

  for (const string of val.split(" ")) {
    obj[string.replace(/^[+-]/, "")] = string.startsWith("-") ? -1 : 1;
  }

  return obj;
}

function normalizeQueryValue(value: any) {
  if (value === "false") return false;
  if (value === "true") return true;
  return value;
}
