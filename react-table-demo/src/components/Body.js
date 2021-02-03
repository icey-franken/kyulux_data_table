import React from "react";

export default function Body({ bodyProps }) {
  const { getTableBodyProps, prepareRow, page } = bodyProps;

  return (
    <div className="rows" {...getTableBodyProps()}>
      {page.map((row, i) => {
        prepareRow(row);
        const props = row.getRowProps();
        return (
          <div
            {...props}
            style={{
              ...props.style,
              backgroundColor: `${
                i % 2 === 0 ? "rgba(0,0,0,0.05)" : "rgba(0,0,0,0.2)"
              }`,
            }}
            className="row body"
            key={i}
          >
            {row.cells.map((cell, idx) => {
              return (
                <div
                  {...cell.getCellProps()}
                  className="cell data-cell"
                  key={idx}
                >
                  {cell.render("Cell")}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
