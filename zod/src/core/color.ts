import 'reflect-metadata'
import colors from 'colors'

export function success(message: string) {
  return colors.bold(colors.green(message))
}

export function error(message: string) {
  return colors.bold(colors.red(message))
}

export function warn(message: string) {
  return colors.bold(colors.yellow(message))
}

export function blue(message: string) {
  return colors.bold(colors.blue(message))
}
