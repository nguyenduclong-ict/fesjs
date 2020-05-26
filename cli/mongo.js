const fs = require("fs");
const Path = require("path");

const MODEL_FILE = `
import { Schema, model } from 'mongoose';
import hooks from './hooks';

const schema = new Schema({
    createdAt: { type: Date, default: Date.now },
});

hooks(schema);
export default model('{name}', schema);
`.trim();

const HOOK_FILE = `
import { Schema } from "mongoose";

export default function (schema: Schema) {
  schema.pre("save", async function (next) {
    next();
  });
}
`.trim();

const PROVIDER_FILE = `
import { Provider } from '@/utils/fesjs/mongo';
import {name} from './model';

class {name}Provider extends Provider {}

export default new {name}Provider({name});
`.trim();

module.exports.generateMongoModel = function (path, ...args) {
    path = path.split("/");
    let name = path.pop();
    name = name.charAt(0).toUpperCase() + name.slice(1);
    path.push(name);
    path = path.join("/");

    const modelPath = Path.join("data", path);

    if (fs.existsSync(modelPath)) {
        console.error(new Error("model " + modelPath + " exists"));
        return;
    }

    fs.mkdirSync(modelPath, { recursive: true });

    fs.writeFileSync(
        modelPath + "/model.ts",
        MODEL_FILE.replace(/{name}/g, name)
    );

    fs.writeFileSync(modelPath + "/hooks.ts", HOOK_FILE);

    fs.writeFileSync(
        modelPath + "/provider.ts",
        PROVIDER_FILE.replace(/{name}/g, name)
    );
};
