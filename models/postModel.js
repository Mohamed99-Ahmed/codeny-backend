const mongoose = require("mongoose");
const validator = require("validator");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "يجب ان تحدد عنوان المنشور"],
    trim: true,
  },
  content: String,
  imageCover: {
    type: String,
  },
  link: {
    type: String,
    validate: {
      validator: function (link) {
        return validator.isURL(link);
      },
      message: "يرجى إدخال رابط صالح",
    },
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "يجب ان تحدد من ناشر هذا المنشور"],
  },
  psotType: {
    type: String,
    enum: ["text", "image"],
    required: [true, "يجب ان تحدد نوع المنشور"],
  },
  postCategory: {
    type: String,
    required: [true, "يجب ان تحدد نوع المنشور"],
    enum: [
      "software development",
      "frontend",
      "backend",
      "fullstack",
      "mobile",
      "game",
      "other",
    ],
    default: "software development",
  },
  createdAt: { type: Date, default: Date.now },
});

// populate author (before find any post or get any post populate autor so you can show all data of user)
postSchema.pre(/^find/, function (next) {
  this.populate("author");
  next();
});

const Post = mongoose.model("Post", postSchema);

module.exports = { Post };
