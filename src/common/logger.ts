import {_, COLOR} from '@common/util'

class Logger {
  /**
   * '[LEVEL] YYYY-mm-ss HH:MM:SS - arg1 arg2 arg3 ...' の形式で出力する
   * @param color 色
   * @param severity ログレベル 
   * @param date 日付
   * @returns prefix
   */
  private generatePrefix(color: string, severity: string, date: Date = new Date()) {
    return `${color}[${severity}] ${_.formatDate(date)}${COLOR.RESET} -`
  }

  /**
   * DEBUGログを出力する
   * @param args 引数
   */
  public debug(...args: any[]): void {
    const prefix = this.generatePrefix(COLOR.BLUE, 'DEBUG')
    console.debug(prefix, ...args)
  }

  /**
   * INFOログを出力する
   * @param args 引数
   */
  public info(...args: any[]): void {
    const prefix = this.generatePrefix(COLOR.GREEN, 'INFO')
    console.info(prefix, ...args)
  }

  /**
   * WARNログを出力する
   * @param args 引数
   */
  public warn(...args: any[]): void {
    const prefix = this.generatePrefix(COLOR.YELLOW, 'WARN')
    console.warn(prefix, ...args)
  }

  /**
   * ERRORログを出力する
   * @param args 引数
   */
  public error(...args: any[]): void {
    const prefix = this.generatePrefix(COLOR.RED, 'ERROR')
    console.error(prefix, ...args)
  }
}

export const logger = new Logger()
