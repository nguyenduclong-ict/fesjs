const Path = require('path')
const fs = require('fs')
const { execSync, exec } = require('child_process')
const logger = require('./logger')
const ora = require('ora')

const EXAMPLE_PROJECT =
    'https://github.com/nguyenduclong-ict/express-typescript.git'
const EXAMPLE_CORE = 'https://github.com/nguyenduclong-ict/fesjs.git'

module.exports.newProject = async function (args = []) {
    const projectName = args[0] // project name
    if (!projectName) {
        return logger.error('Missing project name')
    }

    // Save current dir
    const CURRENT_DIR = process.cwd()
    const PROJECT_DIR = Path.join(CURRENT_DIR, projectName)
    const TMP_DIR = Path.join('/tmp', projectName)
    let loading = ora('Prepare project ...').start()
    try {
        await execPromise(
            `
            rm -rf ${TMP_DIR}
            git clone ${EXAMPLE_PROJECT} ${TMP_DIR}
            cd ${TMP_DIR} && 
            cp env.example.ts env.ts && 
            rm -rf .git && 
            git init && 
            yarn init -y
            `
        )
        // modify package.json
        const packageJson = require(`/tmp/${projectName}/package.json`)
        packageJson.name = projectName
        fs.writeFileSync(
            `/tmp/${projectName}/package.json`,
            JSON.stringify(packageJson, null, 4)
        )
        loading.succeed()
        // Install dependencies
        loading.text = 'Install dependencies'
        loading.start()
        await execPromise(`cd ${TMP_DIR} && yarn`)
        loading.succeed()
        // Copy project to work dir
        await execPromise(`mv ${TMP_DIR} ${PROJECT_DIR}`)
    } catch (error) {
        loading.color = 'red'
        loading.succeed()
        return logger.error(error)
    }
    logger.info('Create Project Success')
}

function execPromise(command) {
    return new Promise((resolve, reject) => {
        exec(command, (err, stdout) => {
            if (err) return reject(err)
            resolve(stdout)
        })
    })
}
