import { MongoClient } from "mongodb";

const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017";
const MONGO_DB = process.env.MONGO_DB || "script_app";

let client = null;
let db = null;

export async function connectToMongo() {
  if (db) return db;
  if (!client) {
    client = new MongoClient(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  await client.connect();
  db = client.db(MONGO_DB);
  console.log("Connected to MongoDB", MONGO_URL, MONGO_DB);
  return db;
}

export function getDb() {
  if (!db) throw new Error("MongoDB not connected. Call connectToMongo first.");
  return db;
}
