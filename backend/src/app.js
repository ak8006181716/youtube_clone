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
// Middleware to parse JSON and URL-encoded data
app.use(express.json({limit:'20kb'}));  // Limit the size of JSON payloads to 20kb
app.use(express.urlencoded({ extended: true,limit:'20kb' }));   // Limit the size of URL-encoded payloads to 20kb
app.use(express.static("public")); // Serve static files from the "public" directory
app.use(cookieParser()); // Parse cookies from incoming requests

//Routes import 
import userRouter from './routes/user.routes.js';
import videoRouter from './routes/video.routes.js';
import likeRouter from './routes/like.routes.js';
import tweetRouter from './routes/tweet.routes.js';
import subscriptionRouter from './routes/subscription.routes.js';
import commentRouter from './routes/comment.routes.js';
import dashboardRouter from './routes/dashboard.routes.js';
import playlistRouter from './routes/playlist.routes.js';

//Router declaration

app.use("/api/v1/users",userRouter);
app.use("/api/v1/videos",videoRouter);
app.use("/api/v1/likes",likeRouter);
app.use("/api/v1/tweets",tweetRouter);
app.use("/api/v1/subscriptions",subscriptionRouter);
app.use("/api/v1/comments",commentRouter);
app.use("/api/v1/dashboard",dashboardRouter);
app.use("/api/v1/playlists",playlistRouter);

export default app;