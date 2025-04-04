import { connection, database } from "../database.js";

// Fetches all fruits with optional filtering by search terms and calorie ranges
const getAllFruits = async (req, res) => {
  try {
    const db = await connection.then(() => database);
    const { minCalories, maxCalories, search } = req.query;
    const filter = {};
    if (minCalories !== undefined || maxCalories !== undefined) {
      filter.calories = {};
      if (minCalories !== undefined) {
        filter.calories.$gte = parseInt(minCalories);
      }
      if (maxCalories !== undefined) {
        filter.calories.$lte = parseInt(maxCalories);
      }
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { taste: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    const fruits = await db.collection("fruits").find(filter).toArray();
    res.status(200).json(fruits);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching fruits", error: error.message });
  }
};

// Searches for fruits by name using case-insensitive pattern matching
const getFruitByName = async (req, res) => {
  try {
    const { name } = req.params;
    const db = await connection.then(() => database);
    if (!name) {
      return res.status(400).json({ message: "Fruit name is required" });
    }
    const fruits = await db
      .collection("fruits")
      .find({ name: { $regex: name, $options: "i" } })
      .toArray();
    if (fruits.length === 0) {
      return res
        .status(404)
        .json({ message: `No fruits found matching ${name}` });
    } else {
      res.status(200).json(fruits);
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching fruit", error: error.message });
  }
};

// Creates a new fruit in the database using sanitized data from validation middleware
const createFruit = async (req, res) => {
  try {
    // Use sanitized fruitData from middleware inside validator.js
    const fruitData = req.sanitizedData;
    const db = await connection.then(() => database);
    const result = await db.collection("fruits").insertOne(fruitData);
    res.status(201).json({
      message: "Fruit created successfully",
      fruitId: result.insertedId,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating fruit", error: error.message });
  }
};

// Populates the database with sample fruit data if the collection is empty
const initializeFruits = async (fruitsData) => {
  try {
    const db = await connection.then(() => database);
    const collectionLength = await db.collection("fruits").countDocuments();
    if (collectionLength === 0) {
      db.collection("fruits")
        .insertMany(fruitsData)
        .then(() => {
          console.log("Fruits initialized with sample data successfully");
        });
    } else {
      console.log("Fruits collection already initialized");
    }
  } catch (error) {
    console.error("Error initializing fruits collection", error);
  }
};
export { getAllFruits, getFruitByName, createFruit, initializeFruits };
