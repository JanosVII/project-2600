import express from "express";
import {
  registerUser,
  getUserByUserID,
  addFavorite,
  getFavorites,
  loginUser,
  getAllUsers,
  removeFavorite,
} from "../controllers/userController.js";
import { validateUserData } from "../middleware/validator.js";

// Express router for user-related API endpoints
const router = express.Router();

// Route to get all users
router.get("/", getAllUsers);

// Route to get a specific user by ID
router.get("/:userID", getUserByUserID);

// Route to get a user's favorite fruits
router.get("/:userID/favorites", getFavorites);

// Route to register a new user, with data validation middleware
router.post("/register", validateUserData, registerUser);

// Route to authenticate a user
router.post("/login", loginUser);

// Route to add a fruit to user's favorites
router.post("/:userID/favorites/:fruitId", addFavorite);

// Route to remove a fruit from user's favorites
router.delete("/:userID/favorites/:fruitId", removeFavorite);

export default router;
