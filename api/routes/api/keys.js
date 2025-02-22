require("dotenv").config();

const NounProject = require("the-noun-project"),
  nounProject = new NounProject({
    key: process.env.NOUNPROJECT_KEY,
    secret: process.env.NOUNPROJECT_SECRET,
  });

const { MongoClient } = require("mongodb");
// Update this with your new connection string from MongoDB Atlas
const uri = process.env.MONGO_URI;

console.log("uri is", uri);
const client = new MongoClient(uri);

// Modern connection approach
async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
  }
}

// Call the connection function
connectToDatabase();

const secretkey = process.env.SECRETKEY;

module.exports = { nounProject, client, secretkey };
