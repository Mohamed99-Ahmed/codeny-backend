const Favorite = require("../models/favoriteModel");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");
const ApiError = require("../utils/apiError");
const httpStataus = require("../utils/httpStatusText");

// Use factory methods for standard CRUD operations
exports.getAllFavorites = factory.getAll(Favorite);
exports.getSingleFavorite = factory.getOne(Favorite);
exports.getUserFavorites = catchAsync(async (req, res, next) => {
  console.log(req.user);
  const doc = await Favorite.find({ user: req.user._id });
  if (!doc) {
    return next(
      new ApiError(
        "no favorite in here please add favorite to yours wishlist",
        404
      )
    );
  }
  res.status(200).json({
    status: httpStataus.SUCCESS,
    data: {
      data: doc,
    },
  });
});

exports.deleteuerFavorites = catchAsync(async (req, res, next) => {
  const doc = await Favorite.deleteMany({ user: req.user._id });
  if (!doc) {
    return next(
      new ApiError(
        "no wishlist plaease add to wishlist then you can dlete",
        404
      )
    );
  }
  res.status(200).json({
    status: httpStataus.SUCCESS,
    data: {
      data: doc,
    },
  });
});
// it will be handled should be authorized by admin or empoloyer
exports.createFavorite = factory.createOne(Favorite);
// it will only handle by adimin
exports.deletFavorite = factory.deleteOne(Favorite);
