const express = require("express");
const http = require("http");
const videoCallSocket = require("./websockets/videoCall.socket");

const app = express();
const server = http.createServer(app);
videoCallSocket(server);

server.listen(5000, () => console.log("Server running on port 5000"));
