import { ObjectId } from "mongodb";
import { connection, database } from "../database.js";

// Track the next available user ID to ensure uniqueness
let nextUserId = 1;

// Initializes nextUserId based on the highest userID in the database
const initializeNextUserId = async () => {
  try {
    const db = await connection.then(() => database);
    const highestUserID = await db
      .collection("users")
      .find({ userID: { $exists: true } })
      .sort({ userID: -1 })
      .limit(1)
      .toArray();
    if (highestUserID.length > 0) {
      nextUserId = highestUserID[0].userID + 1;
    }
    console.log("Next user ID initialized to:", nextUserId);
  } catch (error) {
    console.error("Error initializing next user ID:", error);
  }
};
// Call initialization when the module loads
initializeNextUserId();

// Registers a new user with validated data and increments the userID counter
const registerUser = async (req, res) => {
  try {
    const userData = req.sanitizedData;
    userData.userID = nextUserId;
    nextUserId++;
    const db = await connection.then(() => database);
    const existingUser = await db.collection("users").findOne({
      $or: [{ username: userData.username }, { email: userData.email }],
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }
    const result = await db.collection("users").insertOne(userData);
    res.status(201).json({
      message: "User registered successfully",
      userID: userData.userID,
      username: userData.username,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};

// Retrieves a user by their userID parameter
const getUserByUserID = async (req, res) => {
  try {
    const userID = parseInt(req.params.userID);
    if (isNaN(userID)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    const db = await connection.then(() => database);
    const user = await db.collection("users").findOne({ userID: userID });
    if (!user) {
      return res
        .status(404)
        .json({ message: `No user found with ID ${userID}` });
    }
    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user", error: error.message });
  }
};

// Adds a fruit to a user's favorites collection, preventing duplicates
const addFavorite = async (req, res) => {
  try {
    const userID = parseInt(req.params.userID);
    const fruitId = req.params.fruitId;
    if (isNaN(userID)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    let fruitObjectId;
    if (fruitId) {
      if (!ObjectId.isValid(fruitId)) {
        return res.status(400).json({ message: "Invalid fruit ID" });
      } else {
        fruitObjectId = new ObjectId(fruitId);
      }
    } else {
      return res.status(400).json({ message: "Fruit ID is required" });
    }
    const db = await connection.then(() => database);
    const user = await db.collection("users").findOne({ userID: userID });
    if (!user) {
      return res
        .status(404)
        .json({ message: `No user found with ID ${userID}` });
    }
    const fruit = await db.collection("fruits").findOne({ _id: fruitObjectId });
    if (!fruit) {
      return res
        .status(404)
        .json({ message: `No fruit found with ID ${fruitId}` });
    }
    const existingFavorite = user.favorites.find((fav) =>
      fav.equals(fruitObjectId)
    );
    if (existingFavorite) {
      return res.status(400).json({ message: "Fruit is already in favorites" });
    } else {
      await db
        .collection("users")
        .updateOne({ userID: userID }, { $push: { favorites: fruitObjectId } });
      res.status(200).json({ message: "Fruit added to favorite successfully" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding favorite", error: error.message });
  }
};

// Retrieves all fruits in a user's favorites collection
const getFavorites = async (req, res) => {
  try {
    const userID = parseInt(req.params.userID);
    if (isNaN(userID)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    const db = await connection.then(() => database);
    const user = await db.collection("users").findOne({ userID: userID });
    if (!user) {
      return res
        .status(404)
        .json({ message: `No user found with ID ${userID}` });
    }
    const favorites = user.favorites ? user.favorites : [];
    const favoriteFruits = [];
    if (favorites.length > 0) {
      const fruits = await db
        .collection("fruits")
        .find({ _id: { $in: favorites } })
        .toArray();
      favoriteFruits.push(...fruits);
    }
    res.status(200).json(favoriteFruits);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching favorites", error: error.message });
  }
};

// Authenticates a user by their email and returns user information
const loginUser = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || typeof email !== "string") {
      return res.status(400).json({ message: "Email is required" });
    }
    const db = await connection.then(() => database);
    const user = await db
      .collection("users")
      .findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res
        .status(404)
        .json({ message: `No user found with email ${email}` });
    }
    res.status(200).json({
      message: "Login successful",
      userID: user.userID,
      username: user.username,
      _id: user._id,
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

// Retrieves all users with sanitized data (no sensitive information)
const getAllUsers = async (req, res) => {
  try {
    const db = await connection.then(() => database);
    const users = await db.collection("users").find({}).toArray();
    // Remove sensitive information (needed if passwords were stored - should not be sent to client)
    const sanitizedUsers = users.map((user) => ({
      _id: user._id,
      userID: user.userID,
      username: user.username,
      email: user.email,
      favorites: user.favorites,
    }));
    res.status(200).json(sanitizedUsers);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
};

// Removes a fruit from a user's favorites collection
const removeFavorite = async (req, res) => {
  try {
    const userID = parseInt(req.params.userID);
    const fruitId = req.params.fruitId;
    if (isNaN(userID)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    let fruitObjectId;
    if (fruitId) {
      if (!ObjectId.isValid(fruitId)) {
        return res.status(400).json({ message: "Invalid fruit ID" });
      } else {
        fruitObjectId = new ObjectId(fruitId);
      }
    } else {
      return res.status(400).json({ message: "Fruit ID is required" });
    }
    const db = await connection.then(() => database);
    const user = await db.collection("users").findOne({ userID: userID });
    if (!user) {
      return res
        .status(404)
        .json({ message: `No user found with ID ${userID}` });
    }
    const fruit = await db.collection("fruits").findOne({ _id: fruitObjectId });
    if (!fruit) {
      return res
        .status(404)
        .json({ message: `No fruit found with ID ${fruitId}` });
    }

    const existingFavorite =
      user.favorites && user.favorites.find((fav) => fav.equals(fruitObjectId));

    if (!existingFavorite) {
      return res.status(400).json({ message: "Fruit is not in favorites" });
    } else {
      await db
        .collection("users")
        .updateOne({ userID: userID }, { $pull: { favorites: fruitObjectId } });
      res
        .status(200)
        .json({ message: "Fruit removed from favorites successfully" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error removing favorite", error: error.message });
  }
};
export {
  registerUser,
  getUserByUserID,
  addFavorite,
  getFavorites,
  loginUser,
  getAllUsers,
  removeFavorite,
};
