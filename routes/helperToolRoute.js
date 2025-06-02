const express = require("express");
const router = express.Router(); // router instead of app
const helperTool = require("../controllers/helperToolController");
const authController = require("../controllers/authController");

// Any one can access this route
router.route("/")
    .get(helperTool.getAllhelperTools)
router.route("/:id")
    .get(helperTool.getSinglehelperTool)
    
    // it will only handle by admin 
    router.use(authController.protect, authController.restrictTo("admin"))
    router.route("/:id")
        .delete(helperTool.delethelperTool)
        .patch(helperTool.uploadhelperToolImage, helperTool.resizehelperToolPhoto,helperTool.updatespcifichelperTool);
// only access by admin or empolyer
router.use( authController.restrictTo("admin", "employer"))
router.route("/")
    .post(helperTool.createhelperTool);

    // export the router
module.exports = router;