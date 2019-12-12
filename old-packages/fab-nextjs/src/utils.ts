import chalk from "chalk";

const _log = (str: string) =>
  `${chalk.gray(`[FAB:NextJS]`)} ${str.split(/\n\s*/).join('\n             ')}`
export const log = (str: string) => console.log(_log(str))
export const error = (str: string) => console.log(_log(chalk.red(str)))
