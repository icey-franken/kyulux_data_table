// import React, { useContext } from "react";
export default function TableContext() {
  async function getData() {
    const res = await fetch("https://api.fda.gov/food/event.json?limit=10");
    const data = await res.json();
    console.log(data);
  }

  const tableContext = createContext();
  // return(
  // 	<TableContext.
  // )
}
