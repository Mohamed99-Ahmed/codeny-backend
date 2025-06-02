const express = require("express");
const router = express.Router(); // router instead of app
const groupController = require("../controllers/groupController");
const authController = require("../controllers/authController");

// Any one can access this route
router.route("/")
    .get(groupController.getAllGroups)
router.route("/:id")
    .get(groupController.getSingleGroup)
    
    // it will only handle by admin 
    router.use(authController.protect, authController.restrictTo("admin"))
    router.route("/:id")
        .delete(groupController.deletGroup)
        .patch(groupController.uploadGroupImage, groupController.resizeGroupPhoto,groupController.updatespcificGroup);
// only access by admin or empolyer
router.use( authController.restrictTo("admin", "employer"))
router.route("/")
    .post(groupController.createGroup);

    // export the router
module.exports = router;