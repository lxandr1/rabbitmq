import { connect } from "mongoose";

const URL =
  process.env.MONGO_URL ||
  "mongodb://mongoadmin:secret@localhost:27017/chitchat?authSource=admin&readPreference=primary&directConnection=true&ssl=false";
// test
async function ConnectToDatabase() {
  try {
    const connection = await connect(URL);
    connection && console.log("🚀 Already connect with database...");
  } catch (error) {
    console.log("❌ Something when wrong", error);
  }
}

export default ConnectToDatabase;
