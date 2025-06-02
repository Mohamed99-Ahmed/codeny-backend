const validator = require("validator");
const mongoose = require("mongoose");

// groupsJobsSchema
const groupSchema = new mongoose.Schema({
    name: {
    
        type: String,
        required: [true, "يجب عليك كتابة عنوان الجروب"],
        minLength: [3, "الحد الأدنى لطول عنوان الجروب هو 3 أحرف"],
        maxLength: [20, "الحد الأقصى لطول عنوان الجروب هو 20 حرفًا"],
        trim: true,
        unique:true
    },
    link: {
        type: String,
        required: [true, "يجب عليك إدخال رابط الجروب"],
        validate: {
            validator: function (link) {
                return validator.isURL(link);
            },
            message: "يرجى إدخال رابط صالح",
        },
        unique:true
    },
    socialType:{
        type: String,
        required: [true, "يجب عليك تحديد نوع الجروب"],
        enum: ["telegram", "whatsapp", "discord", "facebook"],
    },
    description:{
        type: String,
        required: [true, "يجب عليك كتابة وصف الجروب"],
        minLength: [3, "الحد الأدنى لطول وصف الجروب هو 3 أحرف"],
        maxLength: [100, "الحد الأقصى لطول وصف الجروب هو 100 حرفًا"],
        trim: true,
    },
    imageCover : {
        type : String
    },
    createdAt: { type: Date, default: Date.now },


})

const Group = mongoose.model("Group", groupSchema);
module.exports =  Group ;