const validator = require("validator");
const mongoose = require("mongoose");

// helpertoolSchema
const helpertoolSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "يجب عليك كتابة عنوان الاداة"],
        maxLength: [15, "الحد الأقصى لطول عنوان الاداة هو 15 حرفًا"],
        trim: true,
    },
    category: {
        type: String,
        required: [true, "يجب عليك تحديد تصنيف الاداة"],
        enum: ["software development","everyone", "frontend", "backend", "fullstack", "mobile", "game", "other", "Ai", "cyberSecurity",  "dataScience", "cloudComputing", "blockchain", "robitics", "other"],
    },
    link: {
        type: String,
        required: [true, "يجب عليك إدخال رابط الاداة"],
        validate: {
            validator: function (link) {
                return validator.isURL(link);
            },
            message: "يرجى إدخال رابط صالح",
        },
    },
    description:{
        type: String,
        required: [true, "يجب عليك كتابة وصف الاداة"],
        minLength: [3, "الحد الأدنى لطول وصف الاداة هو 3 أحرف"],
        maxLength: [100, "الحد الأقصى لطول وصف الاداة هو 100 حرفًا"],
        trim: true,
    },
    imageCover : {
        type : String
    },
    createdAt: { type: Date, default: Date.now },


})

const helperTool = mongoose.model("helperTool", helpertoolSchema);
module.exports =  helperTool ;