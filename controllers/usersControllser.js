const { User } = require("../models/usersModel");
const factory = require("./handlerFactory");
const multer = require("multer");
const ApiError = require("../utils/apiError");
const catchAsync = require("../utils/catchAsync");
const imagekit = require("../utils/imagekit");
const streamifier = require("streamifier"); // لتحويل Buffer إلى Stream
 /*  */
 const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
      if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj; // return the new boj that it have  allowedFields
  };
const multerStorage = multer.memoryStorage() // Store files in memory as Buffer objects
const multerFilter = (req, file, cb) => {
    // if file is image return true so save image 
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(new ApiError('ليست صورة! يرجى تحميل الصور فقط.', 400), false);
    }
  };
  const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
  });
  exports.uploadUserImage = upload.single("photo"); // field name in form is imageCover
  exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
    if (!req.file) return next(); // if no file in request so go to next middleware
  
    const fileBufferStream = streamifier.createReadStream(req.file.buffer);
  
    let bufferData = [];
    fileBufferStream.on("data", (chunk) => {
      bufferData.push(chunk);
    });
  
    fileBufferStream.on("end", async () => {
      const finalBuffer = Buffer.concat(bufferData);
  
      try {
        const response = await imagekit.upload({
          file: finalBuffer.toString("base64"), // لازم يكون base64
          fileName: `user-${req.user.id}-${Date.now()}.jpeg`,
          folder: "/codenyImages/uploads/users", // optional, specify the folder name in ImageKit
        });
  
        req.file.filename = response.url; // نحط رابط الصورة عشان نحفظه مع المنتج
        next();
      } catch (error) {
        console.error(error);
        return next(new ApiError("هناك خطأ في الصورة", 500));
      }
    });
  });

  // update user
  exports.updateMe = catchAsync(async (req, res, next) => {
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.rePassword) {
      return next(
        new ApiError(
          'هذا المسار ليس لتحديثات كلمة المرور. يرجى استخدام /updateMyPassword.',
          400
        )
      );
    }
  
    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, 'name', 'email',"phone", "country", "linkedinLink", "githubLink"); // (name, email, phone , country, linkedinLink, githubLink) only can updated
    if (req.file) filteredBody.photo = req.file.filename; // if you want update photo add to filterBody with its name
  
    // 3) Update user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
      new: true,
      runValidators: true
    });
  
    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser
      }
    });
  });
/* */
// Makeing api more good (filter, sort, pagination)
// get All Users
exports.getallUsers = factory.getAll(User);
// get specefic user
exports.getspeceficUser = factory.getOne(User);
// delete specific User
exports.deleteSpecUser = factory.deleteOne(User);
