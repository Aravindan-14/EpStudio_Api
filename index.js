// server.js

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import http from "http"; // Import http module to work with Socket.IO
import purchaseRouter from "./Router/purchaseRouter.js";
import productRouter from "./Router/productRouter.js";
import loginRouter from "./Router/loginRouter.js";
import registerRouter from "./Router/registerRouter.js";
import verifyToken from "./middleware/verifyToken.js";
import chatRouter from "./Router/chatRouter.js";
import path from "path";
import { Server } from "socket.io";
import { promisePool as db } from "./config/db.js";
const app = express();
const port = 8081;
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

// Serve static files from "public/Products"
app.use("/public/Products", express.static("public/Products"));
app.use("/public/Customer", express.static("public/Customer"));
app.use("/purchase", purchaseRouter);
app.use("/product", productRouter);
app.use("/login", loginRouter);
app.use("/register", registerRouter);
app.use("/chat", chatRouter);

// Protected route using the verifyToken middleware
app.get("/protected", verifyToken, (req, res) => {
  return res.json({
    code: 200,
    status: "Success",
    message: "This is a protected route",
  });
});

const server = http.createServer(app);
const ioConfig = {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
};
const io = new Server(server, ioConfig);

// When a client connects
io.on("connection", (socket) => {
  console.log("New client connected");

  // Listen for the client joining a room
  socket.on("join room", (roomId) => {
    socket.join(roomId);
    console.log(`Client joined room: ${roomId}`);
  });

  // Handle message event from client
  socket.on("chat message", (roomId, data) => {
    console.log(roomId, data, "chatmessage");

    const query = "INSERT INTO message SET ?";

    db.query(query, data, (err, results) => {
      if (err) {
        return console.error("Error inserting data:", err.message);
      }
      console.log("Data inserted successfully:", results);
    });

    io.to(roomId).emit("chat message", data);
  });

  // When the client disconnects
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
