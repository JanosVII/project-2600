import express from "express";
import {
  getAllFruits,
  createFruit,
  getFruitByName,
} from "../controllers/fruitController.js";
import { validateFruitData } from "../middleware/validator.js";

// Express router for fruit-related API endpoints
const router = express.Router();

// Route to get all fruits with optional filtering
router.get("/", getAllFruits);

// Route to search for fruits by name
router.get("/:name", getFruitByName);

// Route to create a new fruit, with data validation middleware
router.post("/", validateFruitData, createFruit);

export default router;
