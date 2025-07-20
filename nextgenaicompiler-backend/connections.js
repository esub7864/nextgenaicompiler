const { GoogleGenAI } = require("@google/genai");
const mongoose = require("mongoose");
require("dotenv").config();

mongoose.set('strictQuery', true);

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});


async function connectAI() {
  let ai = null;
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
  }
  catch(err){
    console.log(err);
  }
  finally{
    return ai;
  }
}

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB connected to Atlas!");
    } catch (err) {
        console.error("❌ MongoDB connection error:", err.message);
        process.exit(1);
    }
};

module.exports = {
  connectAI, connectDB
}
