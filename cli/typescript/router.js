const fs = require("fs");
const Path = require("path");
const log = require("../log");

const SERVICE_FILE = `
import { Request, Response, NextFunction } from 'express';
export async function handle(req: Request, res: Response, next: NextFunction) {}
`.trim();

const ROUTER_FILE = `
import { Router } from 'express';
import * as service from './service';
import * as validator from './validator';
const router = Router();
// ------- Declare router -------

// ------------------------------
export default router;`.trim();

const VALIDATOR_FILE = `
import check from "check-types";
import CreateValidator from "@/utils/fesjs/validator";
export const ValidateBody = CreateValidator(
    {},
    "body"
);
`.trim();

module.exports.generateRouter = function (path) {
    const routerPath = Path.join("routes", path);
    if (fs.existsSync(routerPath)) {
        log.show(log.colors.FgRed)("router", routerPath, "exists");
        return;
    }

    fs.mkdirSync(routerPath, { recursive: true });
    fs.writeFileSync(routerPath + "/service.ts", SERVICE_FILE);
    fs.writeFileSync(routerPath + "/router.ts", ROUTER_FILE);
    fs.writeFileSync(routerPath + "/router.ts", ROUTER_FILE);
};
