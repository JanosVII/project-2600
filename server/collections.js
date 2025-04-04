// Sets up MongoDB collections with validation schemas for fruits and users
const setupCollections = (database) => {
  // Creates fruits collection with schema validation for required fields and data types
  const fruitsCollection = database.createCollection("fruits", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["name", "taste", "description", "calories", "macros"],
        properties: {
          name: {
            bsonType: "string",
            minLength: 1,
            description: "Name of fruit must be at least 1 character",
          },
          taste: {
            bsonType: "string",
            minLength: 1,
            description: "Taste of fruit must be at least 1 character",
          },
          description: {
            bsonType: "string",
            minLength: 1,
            description: "Description of fruit must be at least 1 character",
          },
          calories: {
            bsonType: "number",
            minimum: 0,
            description: "Calories must be a non-negative number",
          },
          macros: {
            bsonType: "object",
            required: ["carbs", "protein", "fat", "fiber"],
            properties: {
              carbs: {
                bsonType: "number",
                minimum: 0,
                description: "Carbs must be a non-negative number",
              },
              protein: {
                bsonType: "number",
                minimum: 0,
                description: "Protein must be a non-negative number",
              },
              fat: {
                bsonType: "number",
                minimum: 0,
                description: "Fat must be a non-negative number",
              },
              fiber: {
                bsonType: "number",
                minimum: 0,
                description: "Fiber must be a non-negative number",
              },
            },
          },
        },
      },
    },
  });

  // Creates users collection with schema validation for username, email, and favorites
  const usersCollection = database.createCollection("users", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["username", "email"],
        properties: {
          username: {
            bsonType: "string",
            minLength: 3,
            description: "Username must be at least 3 characters long",
          },
          email: {
            bsonType: "string",
            pattern: "^\\S+@\\S+\\.\\S+$",
            description: "Email must be a valid email address",
          },
          favorites: {
            bsonType: "array",
            items: {
              bsonType: "objectId",
              description:
                "Each favorite must be a valid ObjectId reference to a fruit",
            },
          },
        },
      },
    },
  });
  return Promise.all([fruitsCollection, usersCollection]);
};
export default setupCollections;
