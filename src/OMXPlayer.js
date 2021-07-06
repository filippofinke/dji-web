const Logger = new (require("./Logger"))("omxplayer");
const { spawn, exec } = require("child_process");

class OMXPlayer {
  constructor(display) {
    this.process = null;
    this.display = display;
    this.shouldBeRunning = false;
  }

  feed(data) {
    if (this.process) {
      this.process.stdin.write(data);
    }
  }

  start() {
    Logger.info(this.display, "start");
    if (!this.process) {
      this.shouldBeRunning = true;
      let process = spawn("omxplayer", ["-o", "hdmi", "--no-keys", "--display", this.display, "pipe:0"], {
        detached: true,
      });

      process.stdin.on("error", (err) => {
        Logger.error("stdin error");
      });

      process.on("exit", (code, signal) => {
        Logger.info(this.display, "exit", code, signal);
        if (code === 1 || this.shouldBeRunning) {
          this.process = null;
          Logger.info(this.display, "restart");
          this.start();
        }
      });

      this.process = process;
    }
  }

  async stop() {
    Logger.info(this.display, "stop");
    this.shouldBeRunning = false;
    let result = await new Promise((resolve, reject) => {
      exec(
        `for pid in $(ps -ef | grep 'omxplayer.*display ${this.display}' | grep -v grep | awk '{print $2}'); do kill -9 $pid; done`,
        (error, stdout, stderr) => {
          this.process = null;
          resolve(stdout);
        }
      );
    });
    return result;
  }
}

module.exports = OMXPlayer;
