// db.js
const { MongoClient, ServerApiVersion } = require('mongodb');

// Load the MongoDB URI from environment variables
const uri ="mongodb+srv://nextjsfullstack:wIt9RHh9dzGnd0Fk@cluster0.mongodb.net/student_management?retryWrites=true&w=majority";

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

  // try {
    console.log("--------checking first console....1")
    await client.connect();
    console.log("------------checking first console....2")
    const db = client.db("student_management");
    console.log(db,"--------checking first console....3")

    cachedClient = client;
    cachedDB = db;

    console.log("✅ MongoDB connected to 'student_management'");

    return { client, db };
  // } catch (error) {
  //   console.error("❌ MongoDB connection failed:", error);
  //   throw error;
  // }
}

module.exports = connectToDB;
