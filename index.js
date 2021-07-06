const Logger = new (require("./src/Logger"))("index");
const Goggles = require("./src/Goggles");
const OMXPlayer = require("./src/OMXPlayer");
const HttpServer = require("./src/HttpServer");
const WebSocketServer = require("./src/WebSocketServer");
const FFmpeg = require("./src/FFmpeg");

let http = new HttpServer(__dirname + "/public", 80);
let ws = new WebSocketServer(http);
let ffmpeg = new FFmpeg();
let consumers = [new OMXPlayer(2), new OMXPlayer(7)];
http.listen();

let lastProcessed = 0;

ws.on("connection", (socket, request) => {
  Logger.info(`client connected from ${request.socket.remoteAddress}`);
  lastProcessed = Date.now();
  ffmpeg.start();

  socket.on("close", () => {
    if (ws.clients.size === 0) {
      ffmpeg.stop();
    }
  });
});

ffmpeg.on("data", (data) => {
  lastProcessed = Date.now();
  ws.broadcast(data);
});

setInterval(() => {
  if (Goggles.goggles && !ffmpeg.stopped && ws.clients.size > 0 && Date.now() - lastProcessed > 5000) {
    Logger.error("ffmpeg stopped sending data to websocket, restarting!");
    ffmpeg.stop();
    ffmpeg.start();
    lastProcessed = Date.now();
  }
}, 1000);

Goggles.scan();

Goggles.on("attach", () => {
  Logger.info("attach");
  for (let consumer of consumers) consumer.start();
});

Goggles.on("data", (data) => {
  for (let consumer of consumers) consumer.feed(data);
  ffmpeg.feed(data);
});

Goggles.on("error", (error) => {
  Logger.error(error);
});

Goggles.on("detach", () => {
  Logger.info("detach");
  for (let consumer of consumers) consumer.stop();
  ffmpeg.stop();
});

Goggles.on("stop", () => {
  Logger.info("stop");
  for (let consumer of consumers) consumer.stop();
  ffmpeg.stop();
  Logger.info("Bye!");
  process.exit(0);
});

process.on("SIGINT", () => {
  Goggles.stop();
});

process.on("uncaughtException", (err) => {
  Logger.error(err);
  Goggles.stop();
});
