const mongoose = require("mongoose");
// // function unchaughtError like print something not declared
// process.on("uncaughtException", (err) => {
//   console.error("UNCAUGHT EXCEPTION! �� Shutting down...");
//   console.error(err.name, err.message);
//   process.exit(1);
// });

const app = require("./app.js");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const port = process.env.PORT || 5000;
let DB = process.env.DATABASE.replace(
  "<db_password>",
  process.env.DATABASE_PASSWORD
);

// conncet to database and error will handle by unhandledRejection funcion
mongoose.connect(DB).then(() => console.log("Database connected"));

// Export the server for Vercel
const server = app.listen(port, () =>
  console.log(`Server running on port ${port}`)
);

// // unhandledRejection error handler like call invalid database
// process.on("unhandledRejection", (err) => {
//   console.log("UNHANDLED REJECTION! 💥 Shutting down...");
//   console.error(err.name, err.message);
//   server.close(() => {
//     process.exit(1);
//   });
// });
