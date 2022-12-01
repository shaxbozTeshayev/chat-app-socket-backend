const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const morgan = require("morgan");
const path = require("path");
const { createServer } = require("https");
const { Server } = require("socket.io");
let app = express();
const { upload } = require("./helper/helpers");
// route
const authRoute = require("./routes/auths");
const messageRoute = require("./routes/messages");
const conversationsRoute = require("./routes/conversations");

// connect to MONGODB
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Mongodb Connected");
  })
  .catch((err) => {
    console.log("Mongodb disconnected", err);
  });

// MIDDLEWARE FUNCTION
app.use(cors());
app.use(express.json());
// setup the logger
app.use(morgan("common"));

// server manzili orqali foydalanuvchilarga fayllarni ko'rsatish (http://localhost:5000/images/)
app.use("/images", express.static(path.join(__dirname, "public/images")));
app.post("/api/upload", upload.single("file"), (req, res) => {
  res.status(200).json("successfully");
});

app.use("/api/auth", authRoute);
app.use("/api/message", messageRoute);
app.use("/api/conversation", conversationsRoute);

// socket
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});

// users data
let users = [];

// add user
const addUser = (userId, socketId) => {
  let isHasUser = false,
    userIndex = -1;
  for (let i = 0; i < users.length; i++) {
    if (users[i].userId === userId) {
      isHasUser = true;
      userIndex = i;
      break;
    }
  }
  if (isHasUser) {
    users[userIndex] = { userId, socketId };
  } else {
    users.push({ userId, socketId });
  }
};

// get user
const getUser = (receiverId) => {
  return users.find((user) => user.userId === receiverId);
};

// delete user
const deleteUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};
const deleteUserWithUserId = (userId) => {
  users = users.filter((user) => user.userId !== userId);
};

// using socket.io
io.on("connection", (socket) => {
  console.log("a user connected");

  // take userId and socketId from user
  socket.on("addUser", (userId) => {
    if (userId) {
      addUser(userId, socket.id);
      console.log(users);
      io.emit("getUsers", users);
    }
  });

  // add user
  socket.on("add_user", (data) => {
    io.emit("added_user", data);
  });

  // add message
  socket.on("send_private_message", (data) => {
    let user = getUser(data.receiverId);
    if (user) io.to(user.socketId).emit("sended_private_message", data);
  });
  // notification message
  socket.on("not_opened_message", (data) => {
    let user = getUser(data.receiverId);
    if (user)
      io.to(user.socketId).emit("not_opened_message_notification", data);
  });

  // exit
  socket.on("deleteUser", (user) => {
    deleteUserWithUserId(user.userId);
    io.emit("getUsers", users);
  });

  // disconnect user
  socket.on("disconnect", () => {
    console.log("User had left");
    deleteUser(socket.id);
    io.emit("getUsers", users);
  });
});

const port = process.env.PORT || 5500;
httpServer.listen(port, () => {
  console.log(port + " is working");
});
