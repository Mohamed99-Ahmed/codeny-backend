const express = require("express");
const router = express.Router(); // router instead of app
const courseController = require("../controllers/courseController");
const authController = require("../controllers/authController");

// Any one can access this route
router.route("/")
    .get(courseController.getAllCourses)
router.route("/:id")
    .get(courseController.getSingleCourse)
    
    // it will only handle by admin 
    router.use(authController.protect, authController.restrictTo("admin"))
    router.route("/:id")
        .delete(courseController.deletCourse)
        .patch(courseController.uploadCourseImage, courseController.resizeCoursePhoto,courseController.updatespcificCourse);
// only access by admin or empolyer
router.use( authController.restrictTo("admin", "employer"))
router.route("/")
    .post(courseController.createCourse);

    // export the router
module.exports = router;