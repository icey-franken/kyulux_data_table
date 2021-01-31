import React from "react";

export default function SortingModal({ showModal }) {

  return showModal ? <div className="sorting-modal">Sorting...</div> : null;
}
