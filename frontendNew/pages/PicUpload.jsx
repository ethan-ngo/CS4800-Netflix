import React, { useState, useEffect } from "react";

function PicUpload() {
  const [profilePicture, setProfilePicture] = useState({ myFile: "" });
  const [response, setResponse] = useState(null);
  const [images, setImages] = useState([]);

  const createPost = async (newImage) => {
    try {
      const res = await fetch("http://localhost:5050/uploads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newImage),
      });
      const data = await res.json();
      setResponse(data);
      fetchImages(); // Fetch images again to update the list
    } catch (error) {
      console.log(error);
      setResponse({ error: "Failed to upload file" });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createPost(profilePicture);
    console.log("Uploaded");
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertToBase64(file);
    console.log(base64);
    setProfilePicture({ ...profilePicture, myFile: base64 });
  };

  const fetchImages = async () => {
    try {
      const res = await fetch("http://localhost:5050/uploads");
      const data = await res.json();
      setImages(data);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          <img src={profilePicture.myFile} alt="" style={{ width: '200px', height: 'auto', borderRadius: '10px' }} />
        </label>
        <input type="file" onChange={(e) => handleFileUpload(e)} />
        <h2>Ethan</h2>
        <button type="submit">Submit</button>
        {response && (
          <div>
            <h3>Response:</h3>
            <pre>{JSON.stringify(response, null, 2)}</pre>
          </div>
        )}
      </form>
      <div>
        <h2>Uploaded Images</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {images.map((image, index) => (
            <img key={index} src={image.myFile} alt="" style={{ width: '200px', height: 'auto', margin: '10px', borderRadius: '10px' }} />
          ))}
        </div>
      </div>
    </div>
  );

  function convertToBase64(file) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  }
}

export default PicUpload;