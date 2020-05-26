const { newProject } = require('./project')
const { generateRouter } = require('./router')
const { generateMongoModel } = require('./mongo')

module.exports = () => {
    let [node, root, command, ...args] = process.argv
    process.env.PROJECT_PATH = root
    command = getCommand(command)
    switch (command) {
        case 'new':
            newProject(args)
            break
        case 'generate':
            generate(...args)
            break
        default:
            break
    }
}

function getCommand(command) {
    if (['generate', 'g'].includes(command)) {
        return 'generate'
    }

    return command
}

/**
 * Handle Generate
 * @param {*} type
 * @param  {...any} args
 */
function generate(type, ...args) {
    if (type === 'router') {
        generateRouter(...args)
        return
    }

    if (type === 'model') {
        const modelType = (
            args.find((a) => ['--mongo', '--mysql'].includes(a)) || '--mongo'
        ).replace(/^--/, '')
        if (modelType === 'mongo') generateMongoModel(...args)
    }
}
