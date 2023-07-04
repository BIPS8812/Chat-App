const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

require('dotenv').config();

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL;

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connection established");
  })
  .catch((err) => {
    console.log(err.message);
  });


const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound } = require("./middleware/errorMiddleware");

// Routes
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/messages", messageRoutes);


//--------------- Deployment --------------------
// const __dirname1 = path.resolve();

// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname1, '/frontend/dist')));

//   app.get("*", (req, res) =>
//     res.sendFile(path.resolve(__dirname1, "frontend", "dist", "index.html"))
//   );
// }
// else {
//   app.get('/', (req, res) => {
//     res.send("Api Running..");
//   })
// }
//--------------- Deployment --------------------

//error handling middleware..
app.use(notFound);

const server = app.listen(PORT, () => {
  console.log("Server listening on port " + PORT);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173"
  }
})

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  socket.on('setup', (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on('join chat', (room) => {
    socket.join(room);
    console.log("User joined chat " + room);
  })

  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
  })

  socket.on("stop typing", (room) => {
    socket.in(room).emit("stop typing");
  })

  socket.on("new message", (newMessage) => {
    let chat = newMessage.chat;

    if (!chat.users) return console.log("chat.users is empty");

    chat.users.forEach((user) => {
      if (user._id === newMessage.sender._id) return;

      socket.in(user._id).emit("message received", newMessage);
    })
  })
})