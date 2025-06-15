import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();
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
app.use(express.json({limit:'20kb'}));
app.use(express.urlencoded({ extended: true,limit:'20kb' }));
app.use(express.static("public"));
app.use(cookieParser());


export default app;