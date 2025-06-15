import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express(); 
     // Enable CORS with credentials and specify the allowed origin
app.use(cors(
    {
        origin: process.env.CLIENT_URL || 'http://localhost:3000',
        credentials: true,
    }
));
app.get('/',(req,res)=>{
    res.send("this is the home server");
}); 
app.get('/hello',(req,res)=>{
    res.send("this is the hello from server");
})
app.use(express.json({limit:'20kb'}));  // Limit the size of JSON payloads to 20kb
app.use(express.urlencoded({ extended: true,limit:'20kb' }));   // Limit the size of URL-encoded payloads to 20kb
app.use(express.static("public")); // Serve static files from the "public" directory
app.use(cookieParser()); // Parse cookies from incoming requests

//Routes import 
import userRouter from './routes/user.routes.js';


//Router declaration

app.use("/api/v1/users",userRouter)








export default app;