const StaticServer = require("node-static").Server;
const http = require("http");
const Logger = new (require("./Logger"))("http");

class HttpServer {
  server = null;
  port = null;

  getServer() {
    return this.server;
  }

  constructor(dir, port) {
    this.port = port;
    let fileHandler = new StaticServer(dir);

    this.server = http.createServer((req, res) => {
      fileHandler.serve(req, res);
    });
  }

  listen() {
    this.server.listen(this.port, () => {
      Logger.info(`Listening on port ${this.port}`);
    });
  }
}

module.exports = HttpServer;
