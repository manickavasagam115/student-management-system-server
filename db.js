// db.js
const { MongoClient, ServerApiVersion } = require('mongodb');

// Load the MongoDB URI from environment variables
const uri = process.env.MONGODB_URI;
console.log(uri,"chcking the uri")
// Cached client and db for reuse
let cachedClient = null;
let cachedDB = null;

async function connectToDB() {
  if (cachedClient && cachedDB) {
    return { client: cachedClient, db: cachedDB };
  }

  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  try {
    await client.connect();
    const db = client.db("student_management");
    cachedClient = client;
    cachedDB = db;
    return { client, db };
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    throw error;
  }
}

module.exports = connectToDB;
