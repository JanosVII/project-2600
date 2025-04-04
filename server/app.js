import express from "express";
import { connection, database } from "./database.js";
import setupCollections from "./collections.js";
import fruitRoutes from "./routes/fruitRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { initializeFruits } from "./controllers/fruitController.js";
import fruitsData from "./data/fruits.js";
const app = express();
const PORT = 3000; // Default is PORT 3000 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/api/v1/fruits", fruitRoutes);
app.use("/api/v1/users", userRoutes);
// Serve the index.html file for all routes that don't match the API routes
app.get("*", (req, res) => {
  res.sendFile("public/index.html", { root: import.meta.dirname });
});
let server;
connection
  .then(() => setupCollections(database))
  .then(() => initializeFruits(fruitsData))
  .then(() => {
    console.log("Successfully connected to the database");
    server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to the database", error);
    process.exit(1);
  });
