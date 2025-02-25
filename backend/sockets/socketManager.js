const socketIo = require("socket.io");

const socketManager = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST", "PUT", "DELETE"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected");

    socket.on("book-appointment", (appointment) => {
      io.emit("appointment-booked", appointment);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  return io;
};

module.exports = socketManager;
