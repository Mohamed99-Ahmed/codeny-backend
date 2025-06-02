const express = require("express");
const router = express.Router(); // router instead of app

const userController = require("../controllers/usersControllser");
const authController = require("../controllers/authController");

// signup
router.route("/signup").post(authController.signUp);
// login
router.route("/login").post(authController.login);
// forgetPassword
router.route("/forgetPassword").post(authController.forgetPassword);
// reset password
router.route("/resetPassword/:token").patch(authController.resetPassword);

//**  protect all these route by authController.protect that middle ware is use first */
router.use(authController.protect);
router.route("/updateMyPassword").patch(authController.updateMyPassword);

// getAllusers
router
  .route("/")
  .get(authController.restrictTo("admin"), userController.getallUsers);
// getSpecefig user and delet user
router
  .route("/:id")
  .get(userController.getspeceficUser)
  .delete(authController.restrictTo("admin"), userController.deleteSpecUser);
// update me (only name or email)
router
  .route("/updateMe")
  .patch(
    userController.uploadUserImage,
    userController.resizeUserPhoto,
    userController.updateMe
  );

// make nested route of user
// router.use('/:tourUser/cart', cart);
module.exports = router;
