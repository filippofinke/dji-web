const Logger = new (require("./Logger"))("ffmpeg");
const Emitter = require("./Emitter");
//const BitCouter = require("./BitCounter");
const { spawn, exec } = require("child_process");

//let bc = new BitCouter("ffmpeg");

class FFmpeg extends Emitter {
  stopped = true;
  process = null;
  canWrite = true;

  start() {
    if (!this.stopped) return;

    Logger.info("start");
    this.stopped = false;
    this.canWrite = true;

    this.process = spawn(
      "ffmpeg",
      ["-r", "60", "-i", "-", "-f", "mpegts", "-c:v", "mpeg1video", "-vf", "scale=480:-2", "-r", "24", "-an", "pipe:1"],
      { detached: true }
    );

    this.process.stdin.on("error", (err) => {
      Logger.error(err.code);
    });

    this.process.stdin.on("drain", () => {
      this.canWrite = true;
    });

    this.process.stdout.on("data", (data) => {
      this.emit("data", data);
    });

    this.process.on("exit", (code, signal) => {
      Logger.info("exit", code, signal);
      if (!this.stopped) {
        this.stopped = true;
        this.process = null;
        this.start();
      }
    });
  }

  feed(data) {
    if (this.canWrite && this.process) {
      //bc.feed(data);
      let result = this.process.stdin.write(data);
      if (!result) {
        this.canWrite = false;
      }
    }
  }

  stop() {
    Logger.info("stop");
    exec("sudo killall -9 ffmpeg");
    this.process = null;
    this.stopped = true;
  }
}

module.exports = FFmpeg;
