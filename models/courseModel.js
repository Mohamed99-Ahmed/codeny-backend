const validator = require("validator");
const mongoose = require("mongoose");

// courseSchema
const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, "يجب عليك كتابة عنوان الكورس"],
    minLength: [3, "الحد الأدنى لطول عنوان الكورس هو 3 أحرف"],
    maxLength: [15, "الحد الأقصى لطول عنوان الكورس هو 15 حرفًا"],
    trim: true,
  },
  link: {
    type: String,
    required: [true, "يجب عليك إدخال رابط الكورس"],
    validate: {
      validator: function (link) {
        return validator.isURL(link);
      },
      message: "يرجى إدخال رابط صالح",
    },
    unique: true,
  },
  category: {
    type: String,
    required: [true, "يجب ان تحدد نوع الكورس"],
    enum: [
      "software development",
      "frontend",
      "backend",
      "fullstack",
      "mobile",
      "Data science",
      "Cyber Sec",
      "Linux",
      "DevOps",
      "AWS",
      "game",
      "other",
    ],
  },
  language: {
    type: String,
    required: [true, "يجب عليك كتابة  عربي او English"],
    enum: ["ُEnglish", "عربي"],
    default: "عربي",
  },
  payed: {
    type: Boolean,
    required: [true, "يجب عليك تحديد هل الكورس مدفوع ام مجاني"],
    default: false,
  },
  description: {
    type: String,
    required: [true, "يجب عليك كتابة وصف الكورس"],
    minLength: [3, "الحد الأدنى لطول وصف الكورس هو 3 أحرف"],
    maxLength: [100, "الحد الأقصى لطول وصف الكورس هو 100 حرفًا"],
    trim: true,
  },
  imageCover: {
    type: String,
  },
  createdAt: { type: Date, default: Date.now },
});

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;
