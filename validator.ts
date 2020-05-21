import { Request, Response, NextFunction } from "express";
import check from "check-types";
import CustomError from "./error/custom-error";
import errors from "@/constant/errors";

/**
 *
 * @param schema Schema validator
 * @param data data for check validate
 */
export default function (schema: any, target: "query" | "body" | "params") {
    return function handle(req: Request, res: Response, next: NextFunction) {
        if (!check.all(check.map(req[target], schema))) {
            return next(new CustomError(errors.VALIDATE));
        }
        next();
    };
}
