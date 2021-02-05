import React, { useState } from "react";

export default function InfoPopup() {
  const [showPopup, setShowPopup] = useState(true);

  return (
    <>
      <div className="header__info-popup-container">
        <div
          className="header__info-popup-button"
          title="Table Info"
          onClick={() => setShowPopup(true)}
        >
          &#x1F6C8;
        </div>
      </div>
      <Popup setShowPopup={setShowPopup} showPopup={showPopup} />
    </>
  );
}

function Popup({ showPopup, setShowPopup }) {
  const listItems = [
    "Sort results based on a single column by clicking on a column header. Click again to reverse sort order; again to remove column sorting.",
    "Sort results based on multiple columns by holding shift while clicking column headers. Primary column sort is first column sorted; secondary column sort is second column sorted; etc.",
    "Reorder columns by dragging column header",
    "Resize columns by adjusting tab on right side of column header",
    "Search a single column using input box below column header.",
		"Search entire dataset using input box at top of table.",
		"NOTE: reorder columns BEFORE sorting/searching columns for improved performance."
  ];

  return (
    <div className={`popup ${showPopup ? "show-popup" : ""}`}>
      <div className="popup-content">
        <div className="popup-content__list-title">Interacting With Table</div>
        <ul className="popup-content__list">
          {listItems.map((text, index) => (
            <li className="popup-content__list-item" key={index}>
              {text}
            </li>
          ))}
        </ul>
        <div
          className="popup__close-button"
          onClick={() => setShowPopup(false)}
        >
          Got it!
        </div>
      </div>
    </div>
  );
}
