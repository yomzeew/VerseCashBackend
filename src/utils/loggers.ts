import chalk from 'chalk';
export default class Log {
    public static info = (args: any) => console.log(chalk.blue(`[${new Date().toDateString()}] [INFO]`), typeof args == 'string' ? chalk.blueBright(args) : args);
    public static success = (args: any) => console.log(chalk.bgBlue(`[${new Date().toDateString()}] [INFO]`), typeof args == 'string' ? chalk.blueBright(args) : args);
    public static error = (args: any) => console.log(chalk.red(`[${new Date().toDateString()}] [INFO]`), typeof args == 'string' ? chalk.redBright(args) : args);
    public static warn = (args: any) => console.log(chalk.yellow(`[${new Date().toDateString()}] [INFO]`), typeof args == 'string' ? chalk.yellowBright(args) : args);
}