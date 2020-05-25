import chalk from 'chalk'

export default {
    log(...args) {
        console.log(...args)
    },
    error(...args) {
        console.log(chalk.bold.red('ERROR'), ...args)
    },
    warning(...args) {
        console.log(chalk.bold.yellow('WARNING'), ...args)
    },
    info(...args) {
        console.log(chalk.bold.green('INFO'), ...args)
    },
}
