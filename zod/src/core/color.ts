import 'reflect-metadata';
import colors from 'colors'

export function success(message: string) {
  return colors.bold(colors.green(message))
}

export function error(message: string) {
  return colors.bold(colors.red(message))
}
