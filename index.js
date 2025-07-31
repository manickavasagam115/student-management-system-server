const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config(); // Important: Load .env

const connectToDB = require("./db");

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Routes
const InfoRouter = require("./infoSchema");

const getFunction = async () => {
  const { db } = await connectToDB();
  const data = await db.collection("student_details").find().toArray();
  return data
}
const postOneFunction = async (studentDetails) => {
  const { db } = await connectToDB();
  console.log(studentDetails, "studentDetails")
  const data = await db.collection("student_details").insertOne(studentDetails);
  return data
}


//-----------------delete

const deleteFunction = async (id) => {
  const { db } = await connectToDB();

  if (typeof id !== 'string') {
    throw new Error("Expected id to be a string.");
  }

  const objectId = new ObjectId(id); // id should be a valid hex string

  const result = await db.collection("student_details").deleteOne({ _id: objectId });

  return result;
};

//-----------update

const { ObjectId } = require("bson");

const updateFunction = async (id, updatedData) => {
  const { db } = await connectToDB();

  if (typeof id !== 'string') {
    throw new Error("Expected id to be a string.");
  }

  const objectId = new ObjectId(id); // ✅ this is valid only if `id` is a hex string

  const result = await db.collection("student_details").updateOne(
    { _id: objectId },
    { $set: updatedData }
  );

  return result;
};



// ----------- Read One Function ----------- //
const readOneFunction = async (id) => {
  const { db } = await connectToDB();

  if (typeof id !== 'string') {
    throw new Error("Expected id to be a string.");
  }

  const objectId = new ObjectId(id);

  const student = await db.collection("student_details").findOne({ _id: objectId });

  return student;
};


// app.use("/info", infoRouter);

// ---------- get api ---------- //
app.get("/", async (req, res) => {
  try {
    const data = await getFunction();
    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// ---------- post api ----------

app.post("/", async (req, res) => {
  // console.log(req.body);
  let data = JSON.stringify(postOneFunction(req.body));
  data = await getFunction();
  res.send(data);
});


///---- update 


app.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const result = await updateFunction(id, updatedData);

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({ message: "Student updated successfully" });
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({ error: "Failed to update student" });
  }
});


//------------------delete


app.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteFunction(id);
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Student not found" });
    }
    const data = await getFunction();
    res.json({ message: "Student deleted successfully", data: data });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({ error: "Failed to delete student" });
  }
});


// ----------- GET /:id Endpoint ----------- //
app.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const student = await readOneFunction(id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
  } catch (error) {
    console.error("Error fetching student:", error);
    res.status(500).json({ error: "Failed to fetch student" });
  }
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  await connectToDB();
  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
}

startServer();

// Start server only after DB is connected
// async function startServer() {
//   // try {
//   await connectToDB();
//   app.listen(5000, () => {
//     console.log("Server running on http://localhost:5000");
//   });

// }

// startServer();
