import React, { useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import {
  useTable,
  useAbsoluteLayout,
  useColumnOrder,
  usePagination,
  useSortBy,
} from "react-table";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import Pagination from "./Pagination";

const getItemStyle = ({ isDragging, isDropAnimating }, draggableStyle) => ({
  ...draggableStyle,
  // some basic styles to make the items look a bit nicer
  userSelect: "none",

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "grey",

  ...(!isDragging && { transform: "translate(0,0)" }),
  ...(isDropAnimating && { transitionDuration: "0.001s" }),

  // styles we need to apply on draggables
});

export default function Table({ columns, data }) {
  // Use the state and functions returned from useTable to build your UI

  const defaultColumn = useMemo(() => ({ width: 200 }), []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    allColumns,
    setColumnOrder,
    // state,
    state: { pageIndex, pageSize },
    pageOptions,
    pageCount,
    page,
    gotoPage,
    previousPage,
    nextPage,
    setPageSize,
    canPreviousPage,
    canNextPage,
  } = useTable(
    {
      columns,
      data,
      // defaultColumn,
      initialState: { pageSize: 10 },
      autoResetPage: false,
      // className: '-striped -highlight'
    },
    useColumnOrder,
    useAbsoluteLayout,
    useSortBy,
    usePagination
  );

  const currentColOrder = React.useRef();

  const paginationProps = {
    pageIndex,
    pageSize,
    pageOptions,
    pageCount,
    // page,
    gotoPage,
    previousPage,
    nextPage,
    setPageSize,
    canPreviousPage,
    canNextPage,
  };

  // Render the UI for your table
  console.log(getTableProps());
  return (
    <>
      <div {...getTableProps()} className="table">
        <div>
          {headerGroups.map((headerGroup, idx) => (
            <DragDropContext
              key={idx}
              onDragStart={() => {
                currentColOrder.current = allColumns.map((o) => o.id);
              }}
              onDragUpdate={(dragUpdateObj, b) => {
                // console.log("onDragUpdate", dragUpdateObj, b);
                const colOrder = [...currentColOrder.current];
                const sIndex = dragUpdateObj.source.index;
                const dIndex =
                  dragUpdateObj.destination && dragUpdateObj.destination.index;
                if (typeof sIndex === "number" && typeof dIndex === "number") {
                  colOrder.splice(sIndex, 1);
                  colOrder.splice(dIndex, 0, dragUpdateObj.draggableId);
                  setColumnOrder(colOrder);
                }
              }}
            >
              <Droppable droppableId="droppable" direction="horizontal">
                {(droppableProvided, snapshot) => (
                  <div
                    {...headerGroup.getHeaderGroupProps()}
                    ref={droppableProvided.innerRef}
                    className="row header-group"
                  >
                    {headerGroup.headers.map((column, index) => {
                      const props = column.getHeaderProps(
                        column.getSortByToggleProps()
                      );
                      return (
                        <Draggable
                          key={column.id}
                          draggableId={column.id}
                          index={index}
                          isDragDisabled={!column.accessor}
                        >
                          {(provided, snapshot) => {
                            // console.log(column.getHeaderProps());
                            // const {
                            //   style,
                            //   ...extraProps
                            // } = column.getHeaderProps();
                            // console.log(style, extraProps);
                            // console.log(props)
                            return (
                              <div
                                {...props}
                                className={`cell header
                                  ${
                                    column.isSorted
                                      ? column.isSortedDesc
                                        ? "descSort"
                                        : "ascSort"
                                      : ""
                                  }`}
                                // {...column.getHeaderProps(column.getSortByToggleProps())}
                                onClick={(e) => {
                                  console.log(column);
                                  // setShowModal(true);
                                  props.onClick(e);
                                  // TODO: find a way to remove modal after sorting complete
                                  // setTimeout(setShowModal(false), 1000);
                                }}
                              >
                                <div
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  // {...extraProps}
                                  ref={provided.innerRef}
                                  style={{
                                    ...getItemStyle(
                                      snapshot,
                                      provided.draggableProps.style
                                    ),
                                    // ...style
                                  }}
                                >
                                  {column.render("Header")}
                                </div>
                              </div>
                            );
                          }}
                        </Draggable>
                      );
                    })}
                    {droppableProvided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          ))}
        </div>

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
								// onHover={()=>}
                className="row body"
                key={i}
              >
                {row.cells.map((cell, idx) => {
                  return (
                    <div {...cell.getCellProps()} className="cell" key={idx}>
                      {cell.render("Cell")}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
      {/* <pre>
        <code>{JSON.stringify(state, null, 2)}</code>
      </pre> */}
      <Pagination paginationProps={paginationProps} />
    </>
  );
}
