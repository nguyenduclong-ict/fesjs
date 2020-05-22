import importAll from "./import-all";
import { Express } from "express";
export default function (app: Express, routerPath?) {
    routerPath = routerPath || process.env.ROUTER_PATH;
    if (!routerPath) throw new Error("routerPath not found!");
    console.log("<* Generate Router *>");
    const moudles = importAll(routerPath);
    moudles
        .filter((m) => /router.js$/.test(m.originName))
        .forEach((element) => {
            const alias =
                element.module.path ||
                element.path
                    .replace(routerPath, "")
                    .replace(/\.*router.js$/, "") // replace a.router.js to a/
                    .replace(/\/*$/, "") // replace a// to a/
                    .replace(/^$/, "/"); // replace '' to '/'
            console.log("=>", alias);
            app.use(alias, element.module.default);
        });

    console.log("<* Generate router success! *>");
}
