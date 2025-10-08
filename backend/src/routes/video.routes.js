import { Router } from "express";
import {
  deleteVideo,
  getAllVideos,
  getVideoById,
  publishAVideo,
  togglePublishStatus,
  updateVideo,
  normalFeedVIdeos
} from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

  router.get("/feed",normalFeedVIdeos);
  router.get("/:videoId",getVideoById);
  

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router
  .route("/")
  .get(getAllVideos)
  .post(
    upload.fields([   
      {
        name: "videoFile",
        maxCount: 1,
      },
      {
        name: "thumbnail",
        maxCount: 1,
      },
    ]),
    publishAVideo
  );

router
  .route("/:videoId")
  .delete(deleteVideo)
  .patch(upload.fields([   
      {
        name: "videoFile",
        maxCount: 1,
      },
      {
        name: "thumbnail",
        maxCount: 1,
      },
      {
        name: "title",
        maxCount: 1,
      },
      {
        name: "description",
        maxCount: 1,
      },
    ]), updateVideo);

router.route("/toggle/publish/:videoId").patch(togglePublishStatus);

export default router;
