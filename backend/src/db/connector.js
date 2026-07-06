import mongoose from "mongoose";
import dns from "node:dns";
import { DB_NAME } from "../constants.js";

const connector = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log(`mongoDB connected !! DB HOST: ${connectionInstance.connection.host} DB NAME: ${connectionInstance.connection.name}`);
  } catch (error) {
    if (error.code === 'ECONNREFUSED' && error.syscall === 'querySrv') {
      console.warn("DNS querySrv failed. Retrying database connection using public DNS servers...");
      try {
        dns.setServers(["8.8.8.8", "8.8.4.4"]);
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`mongoDB connected !! DB HOST: ${connectionInstance.connection.host} DB NAME: ${connectionInstance.connection.name}`);
        return;
      } catch (retryError) {
        console.error("ERROR on database connection retry: ", retryError);
        throw retryError;
      }
    }
    console.error("ERROR: ", error);
    throw error;
  }
};
export default connector;