import winston, { format, transports } from "winston";
import { ENV_OPTION, program } from "../utils.js";

const { Console, File } = transports;
const { combine, timestamp, colorize, simple, json } = format;

const { mode } = program.opts();

const levelOptions = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: "red",
    error: "magenta",
    warning: "yellow",
    info: "white",
    http: "gray",
    debug: "blue",
  },
};

winston.addColors(levelOptions.colors);

const envTransport = {
  [ENV_OPTION.LOCAL]: [
    new Console({
      level: "debug",
      format: combine(colorize(levelOptions.colors), simple()),
    }),
  ],
  [ENV_OPTION.DEV]: [
    new Console({
      level: "debug",
      format: combine(colorize(levelOptions.colors), simple()),
    }),
  ],
  [ENV_OPTION.STAGE]: [
    new File({
      filename: "./errors.log",
      level: "info",
      format: combine(timestamp(), json()),
    }),
  ],
  [ENV_OPTION.PROD]: [
    new File({
      filename: "./errors.log",
      level: "info",
      format: combine(timestamp(), json()),
    }),
  ],
};

export const logger = winston.createLogger({
  levels: levelOptions.levels,
  transports: envTransport[mode],
});
