require("colors");

class Logger {
  prefix = null;

  constructor(prefix) {
    this.prefix = prefix;
  }

  log(level, ...data) {
    let date = new Date().toISOString().replace(/T/, " ").replace(/\..+/, "");
    console.log(`[${date}] |`.gray, level.padEnd(17) + ` |`.gray, this.prefix.padEnd(10) + ` |`.gray, ...data);
  }

  info(...data) {
    this.log("INFO".white, ...data);
  }

  debug(...data) {
    this.log("DEBUG".blue, ...data);
  }

  warning(...data) {
    this.log("WARNING".yellow, ...data);
  }

  error(...data) {
    this.log("ERROR".red, ...data);
  }
}

module.exports = Logger;
