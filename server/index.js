import express from "express";
import http from "http";
import {Server as SocketServer} from "socket.io";

const app = express();
const server = http.createServer(app); // Servidor http
const io = new SocketServer(server); // Servidor de sockets

io.on("connection", (socket) => {
  socket.on("message", (body) => {
    socket.broadcast.emit("message", {
      body,
      from: socket.id.substring(0, 6),
    });
  });
}); // Escuchar eventos de sockets

server.listen(4000);
console.log("Server running on port", 4000);
