const WebSocket = require("ws");
const Logger = new (require("./Logger"))("ws");

class WebSocketServer extends WebSocket.Server {
  constructor(http) {
    super({ server: http.getServer() });
  }

  broadcast(data) {
    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  }
}

module.exports = WebSocketServer;
