const catchAsync = require("../Utils/catchAsync");
const { User } = require("../models/usersModel");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const ApiError = require("../Utils/apiError");
const sendEmail = require("../utils/email");
const crypto = require("crypto");
// create Send Token
const signToken = (id, name, role) => {
  const token = jwt.sign({ id, name, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIREIN,
  });
  return token;
};

// create send token with nice response
const createSendToken = (user, statusCode, res) => {
  // signToken
  const token = signToken(user.id, user.name, user.role);

  //  cokkie that will send to browser that recieve it not token so more secure
  const cookieOptions = {
    expiresIn: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  // if ((process.env.NODE_ENV = "production")) cookieOptions.secure = true; // make secure cookie(token)
  res.cookie("jwt", token, cookieOptions);

  // make invisible password so it will be more secure
  res.password = undefined;
  // response
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

// create new user
exports.signUp = catchAsync(async (req, res, next) => {
  // we take all of that because of security not req.body but with detaails
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    rePassword: req.body.rePassword,
    country: req.body.country,
    phone: req.body.phone,
    role: req.body.role,
    linkedinLink: req.body.linkedinLink,
    githubLink: req.body.githubLink
  });
  // create send token with responese
  createSendToken(newUser, 201, res);
});

// login user
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) check if email and password exist
  if (!email || !password) {
    return next(new ApiError("يجب عليك كتابة البريد الإلكتروني وكلمة المرور", 400));
  }

  // 2) check if user exists & password is correct
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ApiError("هذا الايميل غير مسجل من فضلك قم بانشاء حساب", 401));
  }

  const comparedPass = await user.correctPassword(password, user.password);
  if (!comparedPass) {
    return next(new ApiError("البريد الإلكتروني أو كلمة المرور غير صحيحة", 401));
  }

  // 3) if everything ok, send token
  createSendToken(user, 200, res);
});


// protect Route
exports.protect = catchAsync(async (req, res, next) => {
  // getting token from headers and check it
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // take the secound index that is token and continue this function
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new ApiError(
        "أنت غير مسجل الدخول، يرجى تسجيل الدخول لأخذ الرمز والتمكن من الوصول إلى البيانات",
        401
      )
    );
  }
  // verficate token compare between the secret jwt in tken and in config
  // jwt.verfy return promice function that i can call it with some arguments
  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // check if userr still exist in database or no

  const currentUser = await User.findById(decode.id);

  if (!currentUser) {
    return next(new ApiError("المستخدم الذي ينتمي إلى هذا الرمز غير موجود", 401));
  }
  // check if user change password
  if (currentUser.changePasswordAfter(decode.iat)) {
    return next(new ApiError("تغيير كلمة المرور للمستخدم يرجى تسجيل الدخول مرة أخرى تم", 404));
  }
  // if every things is right go to next middleware(Route)
  req.user = currentUser;

  next();
});

// Authorization (take req.user from the previous middleware protect)
exports.restrictTo = (...roles) => {
  // now roles its an array that have all of Authorization people ["admin", ....]
  //clouture function that can access from parent function
  return (req, res, next) => {
    //check if roles have role of user or no
    if (!roles.includes(req.user.role)) {
      return next(new ApiError("ليس لديك إذن بالوصول لهذة المعلومات", 403));
    }
    // if roles have role that form user go to the next middleware(Route)
    next();
  };
};

// foregetPasssword function
exports.forgetPassword = catchAsync(async (req, res, next) => {
  // get user base on email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError("لا يوجد مستخدم بهذا عنوان البريد الإلكتروني", 404));
  }
  // generate random resetToken with no validate before save becase many of input require like (pass,...)
  const resetToken = user.createPasswordResetToken(); // this function that create token and save it in database
  await user.save({ validateBeforeSave: false });

  // send it to email
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/users/resetPassword/${resetToken}`;
  
  // الرسالة النصية العادية
  const message = `هل نسيت كلمة المرور؟ أعد تعيينها باستخدام هذا الرمز، ثم اكتب كلمة المرور الجديدة وتأكيدها: ${resetToken}`;
  
  // HTML رسالة بتنسيق
  const htmlMessage = `
    <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right; padding: 20px; color: #333;">
      <h2 style="color: #2b3481;">استعادة كلمة المرور</h2>
      <p>هل نسيت كلمة المرور الخاصة بك؟</p>
      <p>استخدم الرمز التالي لإعادة تعيين كلمة المرور الخاصة بك:</p>
      <div style="margin: 20px 0;">
        <span style="background-color: #2b3481; color: white; padding: 10px 15px; border-radius: 5px; font-size: 18px; letter-spacing: 2px; font-weight: bold;">${resetToken}</span>
      </div>
      <p>ثم اكتب كلمة المرور الجديدة وتأكيدها.</p>
      <p>ينتهي هذا الرمز خلال 10 دقائق.</p>
      <p>إذا لم تطلب إعادة تعيين كلمة المرور، فيرجى تجاهل هذا البريد الإلكتروني.</p>
    </div>
  `;

  try {
    await sendEmail({
      email: req.body.email,
      subject: "يمكنك إعادة تعيين كلمة المرور الخاصة بك في (10 دقائق)",
      message,
      html: htmlMessage,
    });
    res.status(200).json({
      status: "success",
      message: "تم إرسال الرمز إلى البريد الإلكتروني!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new ApiError("حدث خطأ أثناء إرسال البريد الإلكتروني. حاول مرة أخرى لاحقًا!"),
      500
    );
  }
});

// reset password with token that get from header
exports.resetPassword = catchAsync(async (req, res, next) => {
  // get user based on reset Token in req param

  const hashToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex"); // hash resettoken to compare with hashed token in database

  const user = await User.findOne({
    passwordResetToken: hashToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  // if token right and find user so take password and rePassword from req.body and save user
  if (!user) {
    return next(new ApiError("الرمز غير صالح أو انتهت صلاحيته", 400));
  }
  user.password = req.body.password;
  user.rePassword = req.body.rePassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save({ validateBeforeSave: false }); // save the user in database
  signToken(user._id, user.name, user.role); // create new token to update token
  res.status(200).json({
    status: "success",
    message: "لقد نجحت في تغيير كلمة المرور الخاصة بك ويمكنك تسجيل الدخول مرة أخرى",
  });
});

// udpdate the password (should user log in because this function work after protect function and take token from it)
exports.updateMyPassword = catchAsync(async (req, res, next) => {
  // find user and select password to appear to compare with current password that user write
  const user = await User.findById(req.user.id).select("+password");
  // تحقق من وجود كلمة المرور الحالية
  if (!req.body.currentPassword) {
    return next(new ApiError("يرجى إدخال كلمة المرور الحالية", 400));
  }

  // compare current password that type with user with in database
  if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
    return next(new ApiError("كلمة المرور الحالية خاطئة", 401));
  }

  // if everything is write send user with create new token
  // User.findByIdAndUpdate will NOT work as intended! because validation
  //  of password and some methods like user.pre(save) not world with findByIdAndUpdate
  user.password = req.body.password;
  user.rePassword = req.body.rePassword;
  await user.save();

  // send response with newToken
  createSendToken(user, 200, res);
});
