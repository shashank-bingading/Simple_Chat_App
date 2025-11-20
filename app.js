const express = require("express");
const path = require("path");
const app = express();

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname, "public")));

let socketsConnected = new Set();

io.on("connection", onConnected);

function onConnected(socket) {
  console.log("New client connected:", socket.id);
  socketsConnected.add(socket.id);

  io.emit("clients-connected", socketsConnected.size);

  socket.on("disconnect", () => {
    console.log(`Client disconnected:${socket.id}`);
    socketsConnected.delete(socket.id);
  });

  socket.on("message", (data) => {
    console.log(data);
    socket.broadcast.emit("chat-message", data);
  });
  socket.on("feedback", (data) => {
    socket.broadcast.emit("feedback", data);
  });
}
