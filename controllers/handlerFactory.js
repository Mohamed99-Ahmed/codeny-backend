// getBurgers from database
const apiFeatures = require("../Utils/apiFeatures");
const catchAsync = require("../Utils/catchAsync");
const ApiError = require("../Utils/apiError");
const httpStataus = require("../Utils/httpStatusText")
const multer = require("multer");
const imagekit = require("../Utils/imagekit");
const streamifier = require("streamifier");

//  createOne document function
exports.createOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: httpStataus.SUCCESS,
      data: {
        data: doc,
      },
    });
  });
};
// deleteOne document function
exports.deleteOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new ApiError("id of document is not correct", 404));
    }
    res.status(200).json({
      status: httpStataus.SUCCESS,
      data: null,
    });
  });
};
// getAll document function
exports.getAll = (Model, popOptions) => {
  return catchAsync(async (req, res, next) => {
    let query = Model.find();
    if (popOptions) query = Model.find().populate(popOptions);
    let featchers = new apiFeatures(query, req.query)
      .filter()
      .sort()
      .limitFields();
    let doc = await featchers.query;
    res.status(200).json({
      status: httpStataus.SUCCESS,
      data: {
        data: doc,
      },
    });
  });
};
// getOne document function
exports.getOne = (Model, popOptions) => {
  return catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = Model.findById(req.params.id).populate(popOptions);
    const doc = await query;
    if (!doc) {
      // retun this error and close the function
      return next(new ApiError("document id in  not correct", 404));
    }
    res.status(200).json({
      status: httpStataus.SUCCESS,
      data: {
        data: doc,
      },
    });
  });
};

// updateOne document function
exports.updateOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(new ApiError("document id is not updated", 404));
    }
    res.status(200).json({
      status: httpStataus.SUCCESS,
      data: {
        data: doc,
      },
    });
  });
};

// update one doucment with image

// update specific document image  + resize image + update Document
const multerStorage = multer.memoryStorage(); // Store files in memory as Buffer objects
const multerFilter = (req, file, cb) => {
  // if file is image return true so save image
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new ApiError("هذا المنشور ليس صورة", 400), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
// Export the multer middleware function directly
exports.uploadDocumentImage = upload.single("imageCover"); // field name in form is imageCover

exports.resizeDocumentPhoto = (Model) => {
  return catchAsync(async (req, res, next) => {
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
          fileName: `${Model.modelName || Model}-${
            req.user.id
          }-${Date.now()}.jpeg`,
          folder: `/codenyImages/uploads/${Model.modelName || Model}s`, // optional, specify the folder name in ImageKit
        });

        req.file.filename = response.url; // نحط رابط الصورة عشان نحفظه مع المنتج
        next();
      } catch (error) {
        console.error(error);
        return next(new ApiError("هناك خطأ في الصورة", 500));
      }
    });
  });
};
// update specific document image  + resize image + update Document
exports.updateOneWithIMage = (Model) => {
  return catchAsync(async (req, res, next) => {
    // This function only handles the database update part
    // Image upload and processing should be done by middleware before this function
    const newObj = { ...req.body };
    if (req.file) newObj.imageCover = req.file.filename;

    const updatedOne = await Model.findByIdAndUpdate(req.params.id, newObj, {
      new: true,
      runValidators: true,
    });

    if (!updatedOne) {
      return next(new ApiError("لم يتم تحديث المجموعة", 404));
    }

    res.status(200).json({
      status: httpStataus.SUCCESS,
      data: {
        data: updatedOne,
      },
    });
  });
};
