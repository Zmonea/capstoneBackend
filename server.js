//Dependencies
const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const socket = require("socket.io");
const app = express();
const server = require("http").createServer(app);
let io = require("socket.io")(server, { 
  cors: { origin: "*",
  methods: ["GET", "POST"],
  credentials: true
 }  });

const cors = require("cors");

const db = mongoose.connection;
require("dotenv").config();

//Middleware
app.use(cors());
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// Port
// Allow use of Heroku's port or your own local port, depending on the environment
const PORT = process.env.PORT || 3003;

// Database
// How to connect to the database either via heroku or locally
const MONGODB_URI = process.env.MONGODB_URI;
// Connect to Mongo &
// Fix Depreciation Warnings from Mongoose
// May or may not need these depending on your Mongoose version
mongoose.connect(MONGODB_URI);

// Error / success
db.on("error", (err) => console.log(err.message + " is Mongod not running?"));
db.on("connected", () => console.log("mongo connected: ", MONGODB_URI));
db.on("disconnected", () => console.log("mongo disconnected"));

//Controllers

// const carsController = require('./controllers/cars.js')
// const userController = require('./controllers/users_controller.js')
// app.use('/cars', carsController)
// app.use('/', userController)

app.get("/", (req, res) => {
  res.send("Hello World");
});

//Listener
server.listen(PORT, () => {
  console.log("Server is Listening...", PORT);
});

mongoose.connection.once("open", () => {
  console.log("Connected to Mongod...");
});
//Socket IO setup

io = socket(server);

io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User Joined Room:` + data);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("disconnect", (socket) => {
    console.log("USER DISCONNECTED");
  });
});
