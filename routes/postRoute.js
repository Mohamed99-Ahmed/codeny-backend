const express = require("express");
const router = express.Router(); // router instead of app

const postController = require("../controllers/postController");
const authController = require("../controllers/authController");
// getAllPosts
router.route("/").get(postController.getAllPosts);
// getsinglePost
router.route("/:id").get(postController.getSinglePost);

router.use(authController.protect)
// get user posts
router.route("/:id").get(postController.getUserPosts);


 // it will only handle by admin 
    router.use(authController.protect, authController.restrictTo("admin"))
    router.route("/:id")
        .delete(postController.deletPost)
        .patch(postController.uploadPostImage, postController.resizePostPhoto,postController.updatespcificPost);



router.use(authController.restrictTo("admin","employer"))
// create post
router.route("/").post(postController.createPost);







module.exports = router;
