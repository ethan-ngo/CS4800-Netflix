import React, { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL; 
const ACCESS_TOKEN = process.env.REACT_APP_ACCESS_TOKEN; 

const MediaDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const media = location.state?.media;

  const videoRef = useRef(null);

  if (!media) {
    return <h1>Loading...</h1>;
  }

  const handleRewind = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
    }
  };

  const handleFastForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(videoRef.current.duration, videoRef.current.currentTime + 10);
    }
  };

  return (
    <div style={styles.container}>
      <button onClick={() => navigate(-1)} style={styles.backButton}>⬅ Go Back</button>

      <div style={styles.detailsContainer}>
        <img
          src={`${API_URL}/Items/${media.Id}/Images/Primary?api_key=${ACCESS_TOKEN}`.replace(/([^:]\/)\/+/g, "$1`")}
          alt={media.Name}
          style={styles.poster}
        />

        <div style={styles.info}>
          <h1>{media.Name}</h1>
          <p><strong>Year:</strong> {media.ProductionYear}</p>
          <p><strong>Rating:</strong> {media.OfficialRating || "Not Rated"}</p>
          <p><strong>Community Rating:</strong> {media.CommunityRating || "N/A"}</p>
          <p><strong>Container:</strong> {media.Container || "Unknown"}</p>
          <p><strong>Run Time:</strong> {Math.floor(media.RunTimeTicks / 600000000)} min</p>
        </div>
      </div>

      <h2>Now Playing:</h2>

      {/* Video Player */}
      <video ref={videoRef} controls style={styles.videoPlayer}>
        <source src={`${API_URL}/Videos/${media.Id}/stream?api_key=${ACCESS_TOKEN}`} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div style={styles.controls}>
        <button onClick={handleRewind} style={styles.controlButton}>⏪ Rewind 10s</button>
        <button onClick={handleFastForward} style={styles.controlButton}>⏩ Forward 10s</button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    color: "#fff",
    backgroundColor: "#121212",
    padding: "20px",
    minHeight: "100vh",
  },
  backButton: {
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    backgroundColor: "#FF4500",
    border: "none",
    color: "#fff",
    borderRadius: "5px",
    marginBottom: "20px",
  },
  detailsContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
    marginBottom: "20px",
  },
  poster: {
    width: "300px",
    borderRadius: "10px",
    boxShadow: "0px 4px 8px rgba(255, 255, 255, 0.2)",
  },
  info: {
    maxWidth: "500px",
    textAlign: "left",
    padding: "10px",
  },
  videoPlayer: {
    width: "80%",
    maxWidth: "800px",
    borderRadius: "10px",
    boxShadow: "0px 4px 8px rgba(255, 255, 255, 0.2)",
    marginBottom: "10px",
  },
  controls: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginTop: "10px",
  },
  controlButton: {
    padding: "10px 15px",
    fontSize: "16px",
    cursor: "pointer",
    backgroundColor: "#008CBA",
    border: "none",
    color: "#fff",
    borderRadius: "5px",
  },
};

export default MediaDetails;