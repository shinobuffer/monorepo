import { compact, isString } from 'es-toolkit';
import { name as pkgName } from '../../package.json';

enum LogLevel {
  Info = 'Info',
  Warn = 'Warn',
  Error = 'Error',
}

enum FgColorCode {
  Default = '39',

  Black = '30',
  Red = '31',
  Green = '32',
  Yellow = '33',
  Blue = '34',
  Magenta = '35',
  Cyan = '36',
  White = '37',

  BrightBlack = '90',
  BrightRed = '91',
  BrightGreen = '92',
  BrightYellow = '93',
  BrightBlue = '94',
  BrightMagenta = '95',
  BrightCyan = '96',
  BrightWhite = '97',
}

enum BgColorCode {
  Default = '49',

  Black = '40',
  Red = '41',
  Green = '42',
  Yellow = '43',
  Blue = '44',
  Magenta = '45',
  Cyan = '46',
  White = '47',

  BrightBlack = '100',
  BrightRed = '101',
  BrightGreen = '102',
  BrightYellow = '103',
  BrightBlue = '104',
  BrightMagenta = '105',
  BrightCyan = '106',
  BrightWhite = '107',
}

enum GraphicCode {
  Reset = '0',
  Bold = '1',
  Italic = '3',
  Underline = '4',
  StrikeThrough = '9',
}

type EscapeCode = FgColorCode | BgColorCode | GraphicCode;

const genEscSequences = (codes: EscapeCode[]) => (codes.length ? `\x1b[${codes.join(';')}m` : '');

const RESET_ESC_SEQUENCES = '\x1b[0m';

interface LevelConfig {
  fgColor?: FgColorCode;
  bgColor?: BgColorCode;
  graphicModes?: GraphicCode[];
}

interface LoggerConfig extends Record<LogLevel, LevelConfig> {
  prefix: (lv: LogLevel) => string;
}

class Logger {
  private config: LoggerConfig;

  constructor(config?: Partial<LoggerConfig>) {
    this.config = {
      prefix: (lv) => `[${lv}]`,
      [LogLevel.Info]: { fgColor: FgColorCode.Blue },
      [LogLevel.Warn]: { fgColor: FgColorCode.Yellow },
      [LogLevel.Error]: { fgColor: FgColorCode.Red, graphicModes: [GraphicCode.Bold] },
      ...config,
    };
  }

  public info(...args: any[]) {
    console.log(...this.processArgs(LogLevel.Info, args));
  }

  public warn(...args: any[]) {
    console.warn(...this.processArgs(LogLevel.Warn, args));
  }

  public error(...args: any[]) {
    console.error(...this.processArgs(LogLevel.Error, args));
  }

  public table<T>(dataSource: T[], columns?: (keyof T)[]) {
    console.table(dataSource, columns as string[] | undefined);
  }

  private processArgs(lv: LogLevel, args: any[]) {
    const { fgColor, bgColor, graphicModes = [] } = this.config[lv];
    const substitutions = args.map((arg) => (isString(arg) ? '%s' : '%o'));

    return [
      `${genEscSequences(compact([fgColor, bgColor, ...graphicModes]))}${this.config.prefix(lv)} ${substitutions.join(' ')}${RESET_ESC_SEQUENCES}`,
      ...args,
    ];
  }
}

export const logger = new Logger({ prefix: () => `${pkgName}:` });
