import React, { useRef, useState } from "react";
import Webcam from "react-webcam";

const Camera = () => {
  const webcamRef = useRef(null);
  const [image, setImage] = useState(null);

  const capturePhoto = () => {
    const photo = webcamRef.current.getScreenshot();
    setImage(photo);
  };

  const savePhoto = () => {
    if (!image) return;

    const link = document.createElement("a");
    link.href = image;
    link.download = "photo.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <h2>Camera App</h2>
      {!image ? (
        <>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/png"
            width={400}
          />
          <button onClick={capturePhoto}>Take Photo</button>
        </>
      ) : (
        <>
          <img src={image} alt="Captured" />
          <button onClick={() => setImage(null)}>Retake</button>
          <button onClick={savePhoto}>Save Photo</button>
        </>
      )}
    </div>
  );
};

export default Camera;
