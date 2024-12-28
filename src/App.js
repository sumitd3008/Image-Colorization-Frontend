import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const ImageColorizer = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [outputImage, setOutputImage] = useState("");
  const [dragging, setDragging] = useState(false);

  // Handle file selection (drag and drop or file input)
  const handleFileChange = (file) => {
    setSelectedFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage("");
    }
  };

  // Drag and Drop Handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileChange(file);
    }
  };

  // Handle file input click
  const handleInputClick = () => {
    document.getElementById("fileInput").click();
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select an image to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await axios.post("http://127.0.0.1:5000/colorize", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setOutputImage(response.data.output);
    } catch (error) {
      console.error("Error during image upload or processing:", error);
      alert("Failed to process the image. Please try again.");
    }
  };

  return (
    <div className="container">
      <h1>Image Colorizer</h1>

      <div
        className={`drag-and-drop ${dragging ? "dragging" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleInputClick}
      >
        <p>
          Drag and drop your image here, or <span>click to select a file</span>
        </p>
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(e.target.files[0])}
        />
      </div>

      <button onClick={handleUpload}>Colorize</button>

      <div className="images-container">
        {previewImage && (
          <div className="image-wrapper">
            <h2>Input Image</h2>
            <img src={previewImage} alt="Input" />
          </div>
        )}

        {outputImage && (
          <div className="image-wrapper">
            <h2>Colorized Image</h2>
            <img src={outputImage} alt="Colorized" />
          </div>
        )}
      </div>

      <footer>© 2024 Image Colorizer App</footer>
    </div>
  );
};

export default ImageColorizer;



