const mongoose = require("mongoose");
const favoriteSchema = new mongoose.Schema({
  typeId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "يجب تحديد id المحتوى"],
    refPath: "typeModel",
  },
  typeModel: {
    type: String,
    required: [true, "يجب تحديد نوع المحتوى"],
    enum: ["Post", "Group", "Website", "helperTool", "Course"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "يجب تحديد المستخدم"],
  },
});

// populate all the data in the favoriteSchema
favoriteSchema.pre(/^find/, function (next) {
  // Using proper populate for dynamic references with refPath
  this.populate({
    path: "typeId",
    // refPath will automatically use the typeModel field to determine which model to use
  }).populate({
    path: "user",
    select: "name email photo", // اختياري: تحديد الحقول التي ترغب في استرجاعها من نموذج المستخدم
  });
  next();
});

const Favorite = mongoose.model("Favorite", favoriteSchema);
module.exports = Favorite;
