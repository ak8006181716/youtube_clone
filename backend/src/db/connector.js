import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connector = async () => {
  try {
   const connectionInstance= await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log(`mongoDB connected !! DB HOST: ${connectionInstance.connection.host} DB NAME: ${connectionInstance.connection.name}`);
  } catch (error) {
    console.error("ERROR: ", error);
    throw error;
    
  }
};
export default connector