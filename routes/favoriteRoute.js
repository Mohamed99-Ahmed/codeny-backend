const express = require("express");
const router = express.Router(); // router instead of app
const favoriteController = require("../controllers/favoriteController");
const authController = require("../controllers/authController");

router.use(authController.protect);
// should authinticate to access this routes

// IMPORTANT: Specific routes must come BEFORE parameterized routes
router
  .route("/user")
  .get(favoriteController.getUserFavorites) // get all favorite for user
  .delete(favoriteController.deleteuerFavorites);

// General routes
router
  .route("/")
  .post(favoriteController.createFavorite)
  .get(favoriteController.getAllFavorites);

// Parameterized routes must come LAST
router
  .route("/:id")
  .get(favoriteController.getSingleFavorite)
  .delete(favoriteController.deletFavorite);

// get all favorite and delete all favorite for user

module.exports = router;
