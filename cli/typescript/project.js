const Path = require("path");
const { execSync } = require("child_process");
const EXAMPLE_PROJECT =
    "https://github.com/nguyenduclong-ict/express-typescript.git";

module.exports.newProject = async function (args = []) {
    const projectName = args[0]; // project name
    if (!projectName) {
        console.error("Missing project name");
        return;
    }
    console.log("Clone project ...");
    execSync(
        `git clone ${EXAMPLE_PROJECT} ${Path.join(process.cwd(), projectName)}`
    );
    execSync(
        `cd ${projectName} && cp env.example.ts env.ts && rm -rf .git && git init && yarn init -y && yarn`
    );
};
