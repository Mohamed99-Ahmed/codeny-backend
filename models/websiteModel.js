const validator = require("validator");
const mongoose = require("mongoose");

// websiteSchema
const websiteSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "يجب عليك كتابة اسم الموقع"],
        minLength: [3, "الحد الأدنى لطول اسم الموقع هو 3 أحرف"],
        maxLength: [25, "الحد الأقصى لطول اسم الموقع هو 25 حرفًا"],
        trim: true,
        unique: true
    },
    link: {
        type: String,
        required: [true, "يجب عليك إدخال رابط الموقع"],
        validate: {
            validator: function (link) {
                return validator.isURL(link);
            },
            message: "يرجى إدخال رابط صالح",
        },
    },
    region:{
        type: String,
        required: [true, "يجب عليك كتابة  ar or en"],
        enum: ["English", "عربي"],
        default: "عربي",
    },
    description:{
        type: String,
        required: [true, "يجب عليك كتابة وصف الموقع"],
        minLength: [3, "الحد الأدنى لطول وصف الموقع هو 3 أحرف"],
        maxLength: [100, "الحد الأقصى لطول وصف الموقع هو 100 حرفًا"],
        trim: true,
    },
    imageCover : {
        type : String
    },
    createdAt: { type: Date, default: Date.now },
})


const Website = mongoose.model("Website", websiteSchema);
module.exports =  Website ;