const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

// userSchema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "يجب عليك كتابة الاسم"],
    minLength: [3, "الحد الأدنى لطول الاسم هو 3 أحرف"],
    maxLength: [15, "الحد الأقصى لطول الاسم هو 15 حرفًا"],
    trim: true,
  },
  headLine:{
    type:String,
         required: [true, "يجب عليك تحديد اختصاصك"],
        enum: ["software developer", "frontend", "backend", "fullstack", "mobile developer", "game developer", "Ai", "cyberSecurity",  "dataScientist", "other"],
  },
  email: {
    type: String,
    unique: [true, "هذا البريد الإلكتروني موجود بالفعل، يرجى اختيار بريد إلكتروني آخر"],
    lowercase: [true, "يجب أن يكون البريد الإلكتروني بأحرف صغيرة"],
    required: [true, "يجب عليك إدخال بريد إلكتروني"],
    validate: [validator.isEmail, "يرجى إدخال بريد إلكتروني صالح"],
  },
  phone: {
    type: String,
  },
  photo: {
    type: String,
    default: "userDefault.png"
  },
  country: {
    type: String,
    default: "egypt",
    minLength: [3, "الحد الأدنى لطول اسم الدولة هو 3 أحرف"],
    maxLength: [15, "الحد الأقصى لطول اسم الدولة هو 15 حرفًا"],
    trim: true,
  },
  role: {
    type: String,
    enum: ["user", "admin", "employer"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "كلمة المرور مطلوبة"],
    select: false,
  },
  linkedinLink: {
    type: String,
    validate: {
      validator: function (el) {
        return validator.isURL(el);
      },
      message: "يرجى إدخال رابط صالح",
    },
  },
  githubLink: {
    type: String,
    validate: {
      validator: function (el) {
        return validator.isURL(el);
      },
      message: "يرجى إدخال رابط صالح",
    },
  },
  rePassword: {
    type: String,
    required: [true, "تأكيد كلمة المرور مطلوب"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "تأكيد كلمة المرور لا يطابق كلمة المرور",
    },
  },
  passwordResetExpires: Date,
  passwordChangedAt: Date,
  passwordResetToken: String,
});

// before save and create make hasing on password
userSchema.pre("save", async function (next) {
  // if not create user next to next middleware
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  // not send to database only on validation when create
  this.rePassword = undefined;
  // next to middleware
  next();
});
// changePasswordAt change if password change
userSchema.pre("save", async function (next) {
  // if not create password or user is new   next to next middleware
  if (!this.isModified("password") || this.isNew) return next();
  // if passwordChanged
  this.passwordChangedAt = Date.now() - 1000;
  next();
});
// correctpasswaord method(add method for every document in this model  that can access and return true or false)
userSchema.methods.correctPassword = async function (candiatePass, userPass) {
  return await bcrypt.compare(candiatePass, userPass);
};

// changePassword after created
userSchema.methods.changePasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    // JWTTimestamp must equal to  passwordChangedAt if in start so this func return false
    // but if change passwordChangedAt it will bigger than JWTTimestamp(initial value of date) so func return true
    // the controller will handle the result
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};
// create password Reset Token (token send to databse but with hash)
userSchema.methods.createPasswordResetToken = function () {
  // إنشاء رمز من 4 أحرف وأرقام فقط
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let resetToken = '';
  
  // إنشاء رمز عشوائي من 4 أحرف/أرقام
  for(let i = 0; i < 4; i++) {
    resetToken += chars[Math.floor(Math.random() * chars.length)];
  }
  
  // تخزين نسخة مشفرة من الرمز في قاعدة البيانات للأمان
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
    
  // تعيين وقت انتهاء صلاحية الرمز (10 دقائق)
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  
  // إرجاع الرمز غير المشفر للمستخدم
  return resetToken;
};

// Make a Model for all products
const User = mongoose.model("User", userSchema);

//   exprorts module
module.exports = { User };
