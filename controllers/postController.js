const catchAsync = require('../Utils/catchAsync');
const { Post } = require('../models/postModel');
const ApiError = require('../Utils/apiError');
const factory = require('./handlerFactory');



// Use factory methods for standard CRUD operations
exports.createPost = factory.createOne(Post);
exports.getAllPosts = factory.getAll(Post);
exports.getSinglePost = factory.getOne(Post);
exports.deletPost = factory.deleteOne(Post)

// GET USER POSTS (by params id or req.user.id when user login )
exports.getUserPosts = catchAsync(async (req, res, next) => {
  const userId = req.params.userId || req.user.id;
  
  const posts = await Post.find({ author: userId }).sort('-createdAt');
    if(!posts){
        return next(new ApiError('لا يوجد منشورات لهذا المستخدم', 404));
    }
  res.status(200).json({
    status: 'success',
    results: posts.length,
    data: {
      posts
    }
  });
});

// update specific post image  + resize image + update post
exports.uploadPostImage = factory.uploadDocumentImage;
exports.resizePostPhoto = factory.resizeDocumentPhoto(Post);
exports.updatespcificPost = factory.updateOneWithIMage(Post);
