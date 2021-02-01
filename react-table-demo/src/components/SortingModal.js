import React from "react";

export default function SortingModal() {
  const showModal = true;
  return showModal ? (
    <div className="-loading -active">
			{/* sorting-modal  */}
      <div className="-loading-inner">Sorting...</div>
    </div>
  ) : null;
}
