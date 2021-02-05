import React, { useState } from "react";

export default function InfoPopup() {
  const [showPopup, setShowPopup] = useState(false);

  const handleClick = () => {
    console.log("hits");
    setShowPopup(true);
  };
  return (
    <>
      <div className="header__info-popup-container">
        <div className="header__info-popup-button" onClick={handleClick}>
          &#x1F6C8;
        </div>
      </div>
      <Popup setShowPopup={setShowPopup} showPopup={showPopup} />
    </>
  );
}

function Popup({ showPopup, setShowPopup }) {
  const handleClick = () => {
    setShowPopup(false);
  };
  return (
    <div className={`popup ${showPopup ? "show-popup" : ""}`}>
      <div className="popup-content">
        <span className="close-button" onClick={handleClick}>
          &times;
        </span>
        <h1>Hello, I am a modal!</h1>
      </div>
    </div>
  );
}
