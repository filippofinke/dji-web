const Logger = new (require("./Logger"))("bitcounter");

class BitCounter {
  constructor(prefix) {
    this.prefix = prefix;
    this.bits = 0;
    this.date = new Date().getTime();
  }

  feed(data) {
    this.bits += data.length * 8;

    let currentTime = new Date().getTime();
    if (currentTime - this.date >= 1000) {
      Logger.debug(this.prefix + "\t" + (this.bits / 1024 / 1024).toFixed(2) + " Mbit/s");
      this.bits = 0;
      this.date = currentTime;
    }
  }
}

module.exports = BitCounter;
