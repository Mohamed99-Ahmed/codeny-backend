/* eslint-disable no-undef */
// @ts-nocheck
const express = require("express");
const app = express();
// routes
const usersRoute = require("./routes/usersRoute");
const postRoute = require("./routes/postRoute");
const websiteRoute = require("./routes/websiteRoute");
const groupRoute = require("./routes/groupRoute");
const courseRoute = require("./routes/courseRoute");
const helperToolRoute = require("./routes/helperToolRoute");
const favoriteRoute = require("./routes/favoriteRoute");
// cors and Error
const cors = require("cors");
const ApiError = require("./utils/apiError");
const globalErrorHandler = require("./controllers/errorController");

// security package
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const path = require("path");

// Middle wares
app.use(express.json()); // read json data from body
app.use("/public", express.static(path.join(__dirname, "public"))); // serve static files from public folder
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // serve static files from public folder

// Enable CORS for all routes get and post api
app.use(cors());

// Enable CORS for all routes put and delete api
app.options("*", cors());
app.get("/", (req, res) => {
  res.send("Server is running successfully");
});

// security package
// 1) rateLimit ( limit the maxiumum of request for api)
// 2)  helmet (secure by setting HTTP)
// 3) xxs-clean(secure against nosql => Sanitize untrusted HTML that in req.body)
// express-mongo-sanitize ( secure agaist coding hack in req.body => sanitze coding hack in req.body)
// 4) hpp (remove duplicate query in request and take the last on only that you want make error if you dublicate  )
app.use(
  hpp({
    whitelist: ["sort"], // will make error if you put on of them dublicate like old way
  })
);
// Add CreatedAt middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString(); // Store request time as a string
  next();
});

//  Routes
app.use("/users", usersRoute);
app.use("/posts", postRoute);
app.use("/websites", websiteRoute);
app.use("/groups", groupRoute);
app.use("/courses", courseRoute);
app.use("/helperTools", helperToolRoute);
app.use("/favorites", favoriteRoute);
// if route not found upper go to this route and this error will go to the next middleware of error
app.use("*", (req, res, next) => {
  next(new ApiError("هذا المسار غير موجود", 404));
});
// erorr handler middleware that will use for every erorr in any middleware
app.use(globalErrorHandler);
//listen to server
module.exports = app;
