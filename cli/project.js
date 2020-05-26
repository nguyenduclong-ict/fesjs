const Path = require('path')
const fs = require('fs')
const { execSync } = require('child_process')
const logger = require('./logger')
const ora = require('ora')

const EXAMPLE_PROJECT =
    'https://github.com/nguyenduclong-ict/express-typescript.git'
const EXAMPLE_CORE = 'https://github.com/nguyenduclong-ict/fesjs.git'

module.exports.newProject = async function (args = []) {
    const projectName = args[0] // project name
    if (!projectName) {
        console.error('Missing project name')
        return
    }
    let loading = ora('Prepare project ...').start()
    execSync(`git clone ${EXAMPLE_PROJECT} ${projectName}`)
    execSync(
        `
        cd ${projectName} && 
        cp env.example.ts env.ts && 
        rm -rf .git && git init && 
        yarn init -y
        `
    )
    // modify package.json
    const packageJson = require(`${projectName}/package.json`)
    packageJson.name = projectName
    fs.writeFileSync(`${projectName}/package.json`, packageJson)
    loading.succeed()
    loading = ora('Install dependencies').start()
    // Install dependencies
    execSync(`cd ${projectName} && yarn`)
    loading.succeed()
    logger.info('Init Project Success')
}
