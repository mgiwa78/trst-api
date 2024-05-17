const bodyParser = require("body-parser");
const express = require("express");
const fs = require("fs");
const userRoutes = require("./routers/user-routes");
const beatRoutes = require("./routers/BeatRoutes");
const guardRoutes = require("./routers/GuardRoutes");
const mobileRoutes = require("./routers/mobile_routes");
const { default: mongoose } = require("mongoose");
const cors = require("cors");
const path = require("path");
const { settingsRouter } = require("./routers/settings-route");
const { rootRouter } = require("./routers/rootRouter");
const multer = require("multer");
require("dotenv").config();

const app = express();
// const whitelist = ["https://guardtrol.alphatrol.com"];

const corsOptions = {
  origin: "*",
  credentials: true,
};

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use("/api", rootRouter);
// app.use("/uploads/images", express.static(path.join("uploads", "images")));
app.use("/Emails", express.static("Emails"));
app.use("/uploads/images/", express.static("uploads/images"));
app.use("/uploads/users/profiles/", express.static("uploads/users/profiles"));
app.use("/uploads/guards/profiles", express.static("uploads/guards/profiles"));

app.use("/api/users", userRoutes);
app.use("/api/beat", beatRoutes);
app.use("/api/guard", guardRoutes);

app.use("/api/mobile", mobileRoutes);
app.use(settingsRouter);
app.use((error, req, res, next) => {
  res.status(error.statusCode).json({ message: error.message });
});

mongoose
  .connect(
    "mongodb+srv://guardtrol:8XieP5DPyELyj75i@cluster0.qphub7h.mongodb.net/guardtroldb?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("connected");
    app.listen(5000, "0.0.0.0");
  })
  .catch((err) => {
    console.log("Error in connecting to the database", err);
  });

// mongoose
//   .connect("mongodb://localhost:27017/guardtrol")
//   .then(() => {
//     console.log("connected");
//     app.listen(5000);
//   })
//   .catch((err) => {
//     console.log("Error in connecting to the database", err);
//   });
