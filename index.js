// @ts-nocheck
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});

const mongoose = require("mongoose");
const app = require("./app.js");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const port = process.env.PORT || 5000;
let DB = process.env.DATABASE.replace(
  "<db_password>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then(() => console.log("Database connected"))
  .catch((err) => {
    console.error("DB Connection Error:", err);
    process.exit(1);
  });

const server = app.listen(port, () =>
  console.log(`Server running on port ${port}`)
);

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION! 💥 Shutting down...");
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
