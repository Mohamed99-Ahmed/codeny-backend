const mongoose = require("mongoose");

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

