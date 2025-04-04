import { MongoClient, ServerApiVersion } from "mongodb";

// Creates MongoDB client using connection string from environment variables
const client = new MongoClient(process.env.CONNECTION_STRING, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

process.on("SIGINT", () => {
  client.close();
  console.log("closed database connection!");
  process.exit(1);
});

// Establishes connection and creates database instance for use across the application
let connection = client.connect();
const database = client.db("fruit-database");

export { connection, database };
