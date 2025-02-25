const socketIo = require("socket.io");

const socketManager = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: "https://babysteps-appointment-app.onrender.com",
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
