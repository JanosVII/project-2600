import validator from "validator";
import { ObjectId } from "mongodb";

// Validates and sanitizes fruit data from request body
const validateFruitData = (req, res, next) => {
  const { name, taste, description, calories, macros } = req.body;
  const errors = [];

  // Validate name field
  if (!name) {
    errors.push("Fruit name is required");
  } else if (!validator.isLength(name, { min: 1 })) {
    errors.push("Fruit name must be at least 1 character");
  }

  // Validate taste field
  if (!taste) {
    errors.push("Fruit taste is required");
  } else if (!validator.isLength(taste, { min: 1, max: 50 })) {
    errors.push(
      "Fruit taste must be at least 1 character and at most 50 characters"
    );
  }

  // Validate description field
  if (!description) {
    errors.push("Fruit description is required");
  } else if (!validator.isLength(description, { min: 1, max: 200 })) {
    errors.push(
      "Fruit description must be at least 1 character and at most 200 characters"
    );
  }

  // Validate calories field
  if (calories === undefined) {
    errors.push("Fruit calories is required");
  } else if (!validator.isInt(calories.toString(), { min: 0, max: 1000 })) {
    {
      errors.push(
        "Fruit calories must be a non-negative number and at most 1000"
      );
    }

    // Validate macros object and its properties
    if (!macros || typeof macros !== "object") {
      errors.push("Fruit macros is required and must be an object");
    } else {
      if (macros.carbs === undefined) {
        errors.push("Fruit macros carbs is required");
      } else if (
        !validator.isFloat(macros.carbs.toString(), { min: 0, max: 1000 })
      ) {
        errors.push(
          "Fruit macros carbs must be a non-negative number and at most 1000"
        );
      }
      if (macros.protein === undefined) {
        errors.push("Fruit macros protein is required");
      } else if (
        !validator.isFloat(macros.protein.toString(), { min: 0, max: 1000 })
      ) {
        errors.push(
          "Fruit macros protein must be a non-negative number and at most 1000"
        );
      }
      if (macros.fat === undefined) {
        errors.push("Fruit macros fat is required");
      } else if (
        !validator.isFloat(macros.fat.toString(), { min: 0, max: 1000 })
      ) {
        errors.push(
          "Fruit macros fat must be a non-negative number and at most 1000"
        );
      }
      if (macros.fiber === undefined) {
        errors.push("Fruit macros fiber is required");
      } else if (
        !validator.isFloat(macros.fiber.toString(), { min: 0, max: 1000 })
      ) {
        errors.push(
          "Fruit macros fiber must be a non-negative number and at most 1000"
        );
      }
    }
  }

  // Return validation errors if any
  if (errors.length > 0) {
    return res.status(400).json({ message: "Fruit validation Error", errors });
  }

  // Create sanitized data object for next middleware/controller
  req.sanitizedData = {
    name: validator.trim(name),
    taste: validator.trim(taste),
    description: validator.trim(description),
    calories: parseInt(calories),
    macros: {
      carbs: parseFloat(macros.carbs),
      protein: parseFloat(macros.protein),
      fat: parseFloat(macros.fat),
      fiber: parseFloat(macros.fiber),
    },
  };

  next();
};

// Validates and sanitizes user data from request body
const validateUserData = (req, res, next) => {
  const { username, email, favorites } = req.body;
  const errors = [];

  // Validate username field
  if (!username) {
    errors.push("Username is required");
  } else if (!validator.isLength(username, { min: 1 })) {
    errors.push("Username must be at least 1 character");
  }

  // Validate email field
  if (!email) {
    errors.push("Email is required");
  } else if (!validator.isEmail(email)) {
    errors.push("Email must be a valid email address");
  }

  // Validate favorites array if provided
  if (favorites !== undefined) {
    if (!Array.isArray(favorites)) {
      errors.push("Favorites must be an array");
    } else if (favorites.length > 0) {
      for (const favorite of favorites) {
        if (!ObjectId.isValid(favorite)) {
          errors.push(`Favorite ${favorite} is not a valid ObjectId`);
        }
      }
    }
  }

  // Return validation errors if any
  if (errors.length > 0) {
    return res.status(400).json({ message: "User validation Error", errors });
  }

  // Create sanitized data object for next middleware/controller
  req.sanitizedData = {
    username: validator.trim(username),
    email: validator.trim(email.toLowerCase()),
    favorites: Array.isArray(favorites)
      ? favorites.map((favorite) => ObjectId(favorite))
      : [],
  };
  next();
};

export { validateFruitData, validateUserData };
