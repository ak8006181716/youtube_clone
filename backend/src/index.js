import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import connector from "./db/connector.js";

const PORT = process.env.PORT || 5000;

  connector()
    .then(() => { 
      app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server is running on port ${PORT}`);
      });
      app.on("error",err =>{
        console.error("Error starting server:", err);
      })
      console.log("Database connected successfully")
    })
    .catch((error) => console.error("Database connection failed:", error));



