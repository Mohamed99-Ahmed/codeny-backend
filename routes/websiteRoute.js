const express = require("express");
const router = express.Router(); // router instead of app
const websiteController = require("../controllers/websiteController");
const authController = require("../controllers/authController");

// Any one can access this route
router.route("/").get(websiteController.getAllWebsites);
router.route("/:id").get(websiteController.getSingleWebsite);

// it will only handle by admin
router.use(authController.protect, authController.restrictTo("admin"));
router
  .route("/:id")
  .delete(websiteController.deletWebsite)
  .patch(
    websiteController.uploadWebsiteImage,
    websiteController.resizeWebsitePhoto,
    websiteController.updatespcificWebsite
  );
// only access by admin or empolyer
router.use(authController.restrictTo("admin", "employer"));
router.route("/").post(websiteController.createWebsite);

module.exports = router;
