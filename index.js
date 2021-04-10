const app = require("./backend/app");
const debug = require("debug")("node-angular");
const http = require("http");

const normalizePort = val => {
  var PORT = parseInt(val, 10);

  if (isNaN(PORT)) {
    // named pipe
    return val;
  }

  if (PORT >= 0) {
    // port number
    return PORT;
  }

  return false;
};

const onError = error => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof PORT === "string" ? "pipe " + PORT : "port " + PORT;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const onListening = () => {
  const addr = server.address();
  const bind = typeof PORT === "string" ? "pipe " + PORT : "port " + PORT;
  debug("Listening on " + bind);
};

const PORT = normalizePort(process.env.PORT || 5000);
app.set("port", PORT);

const server = http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);
server.listen(PORT);
