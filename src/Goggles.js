const usb = require("usb");
const Emitter = require("./Emitter");
const Logger = new (require("./Logger"))("goggles");

class Goggles {
  static emitter = new Emitter();
  static bufferSize = 1024 * 512;
  static goggles = null;

  static on(type, ...data) {
    this.emitter.on(type, ...data);
  }

  static scan() {
    Logger.info("Scanning for DJI Goggles...");
    let interval = setInterval(() => {
      let device = usb.findByIds(11427, 31);
      if (device) {
        this.goggles = device;
        this.emitter.emit("attach");
        this.start();
        clearInterval(interval);
      }
    }, 500);
  }

  static start() {
    this.goggles.open();
    let deviceInterface = this.goggles.interface(3);

    if (deviceInterface.isKernelDriverActive()) {
      Logger.info("detachKernelDriver");
      deviceInterface.detachKernelDriver();
    }

    deviceInterface.claim();

    let [output, input] = deviceInterface.endpoints;

    let command = Buffer.from("524d5654", "hex");

    output.transfer(command, (error) => {
      if (error) this.emitter.emit("error", error);
    });

    output.on("error", (error) => {
      this.emitter.emit("error", error);
    });

    input.on("data", (data) => {
      this.emitter.emit("data", data);
    });

    input.on("error", (error) => {
      this.emitter.emit("error", error);
    });

    input.on("end", () => {
      this.emitter.emit("detach");
      this.scan();
    });

    input.startPoll(1, this.bufferSize);
  }

  static stop() {
    if (this.goggles) {
      this.goggles.interface(3).release(true, () => {
        this.goggles.close();
        this.goggles = null;
        this.emitter.emit("stop");
      });
    } else {
      this.emitter.emit("stop");
    }
  }
}

module.exports = Goggles;
