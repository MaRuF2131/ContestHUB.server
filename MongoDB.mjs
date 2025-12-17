import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db;
const  mongo=async() => {
  try {
    if(db) return db
    /* await client.connect(); */
    db = client.db('contestHUB');
    // Ensure the collection is created
    // Optional: Create index
    // await db.collection('users').createIndex({ email: 1 }, { unique: true });
    console.log("✅ MongoDB connected");
    return db;
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
  }
};
export default mongo;
