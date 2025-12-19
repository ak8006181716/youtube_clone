import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { publishVideo } from "../services/videoService.js";
import { useAuth } from "../services/Auth.jsx";

const Upload = () => {
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [Thumbnail, setThumbnail] = useState("");

  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("videoFile", video);
      fd.append("title", title);
      fd.append("description", description);
      fd.append("thumbnail", Thumbnail);

      await publishVideo(fd);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl py-2 font-bold">Upload</h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-2 w-96">
        {/* File upload */}
        <div className="flex flex-col gap-2 bg-white p-3 border rounded-xl">
        <label className="font-bold">Select video</label>
        <input
          type="file"
          accept="video/*"
          required
          aria-label="Select video"
          onChange={(e) => setVideo(e.target.files?.[0] || null)}
          className="inputfields w-full"
        />
        </div>
        <div className="flex flex-col gap-2  bg-white p-3 border rounded-xl">
        <label className="font-bold">Select thumbnail</label>
        
         <input
          type="file"
          accept="image/*"
          required
          aria-label="Select thumbnail"
          onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
          className="inputfields w-full"
        />
        </div>
        {/* Input fields */}
        <div className="flex flex-col gap-2 bg-white p-3 border rounded-xl">
          <label className="font-bold">Title</label>
        
        <input
          type="text"
          placeholder="Title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="inputfields w-full placeholder-black"
        />
        </div>
        <div className="flex flex-col gap-2 bg-white p-3 border rounded-xl">
          <label className="font-bold">Description</label>
        
        <input
          type="text"
          placeholder="Description"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="inputfields w-full"
        />
       
       </div>
       
        

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="btnn w-full mt-2 py-2 bg-blue-500 text-white rounded"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>

        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>
    </div>
  );
};

export default Upload;
