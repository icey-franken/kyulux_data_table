import React, { useRef, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { GlobalFilter } from "./Filters";
import InfoPopup from "./InfoPopup";

export default function HeaderComp({ headerProps }) {
  const {
    headerGroups,
    visibleColumns,
    preGlobalFilteredRows,
    globalFilter,
    setGlobalFilter,
    handleDragEnd,
  } = headerProps;

  const [resizing, setResizing] = useState(false);

  const getItemStyle = (
    { isDragging, isDropAnimating },
    draggableStyle,
    isResizing
  ) => {
    const itemStyle = isResizing
      ? { background: "grey" }
      : {
          // prevent highlighting
          userSelect: "none",
          // change background colour if dragging
          background: isDragging ? "grey" : "initial",
          ...draggableStyle,
          ...(isDropAnimating && { transitionDuration: "0.001s" }),
          pointerEvents: "auto",
          touchAction: "none",
          transform: null,
          ...(isDragging && !isDropAnimating
            ? {
                position: "fixed",
                top: "0px",
                left: "0px",
                borderRadius: "5px",
              }
            : {
                position: "absolute",
                background: "lightgrey",
                top: "0px",
                left: "0px",
              }),
        };
    return itemStyle;
  };

  return (
    <div className="sticky-header header">
      <div className="header__top-row" colSpan={visibleColumns.length}>
        <InfoPopup />
        <GlobalFilter
          preGlobalFilteredRows={preGlobalFilteredRows}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
      </div>
      {headerGroups.map((headerGroup, hg_idx) => {
        // only use secondary headers
        return hg_idx === 0 ? null : (
          <Droppable
            key={hg_idx}
            droppableId="droppable"
            direction="horizontal"
          >
            {(droppableProvided, snapshot) => (
              <div
                {...headerGroup.getHeaderGroupProps()}
                ref={droppableProvided.innerRef}
                className="row header-group"
                // this prevents resizing being left as true - if user tries to drag and it doesn't work, release of click will set resizing to false and allow drag
                onMouseUp={(e) => setResizing(false)}
              >
                {headerGroup.headers.map((column, col_idx) => {
                  const props = column.getHeaderProps(
                    column.getSortByToggleProps()
                  );
                  return (
                    <Draggable
                      key={column.id}
                      draggableId={column.id}
                      index={col_idx}
                      isDragDisabled={
                        !(column.accessor && !column.isResizing && !resizing)
                      }
                    >
                      {(draggableProvided, snapshot) => {
                        const heading = column.render("Header");
                        return (
                          <>
                            <div
                              {...props}
                              className={`cell header`}
                              ref={draggableProvided.innerRef}
                              {...draggableProvided.draggableProps}
                              {...draggableProvided.dragHandleProps}
                              style={{
                                ...getItemStyle(
                                  snapshot,
                                  draggableProvided.draggableProps.style,
                                  column.isResizing
                                ),
                                ...props.style,
                              }}
                              // negate click handler from {...props} above. Click handler from props moved to further nested div so that clicking in search bar does not trigger a sort
                              onClick={null}
                            >
                              <div
                                className={`sortable ${
                                  column.isSorted
                                    ? column.isSortedDesc
                                      ? "descSort"
                                      : "ascSort"
                                    : ""
                                }`}
                                onClick={(e) => {
                                  // check that column sort click handler exists before sorting
                                  // prevent resorting if resizing or dragging
                                  if (
                                    typeof props.onClick === "function" &&
                                    !resizing &&
                                    e.target.id !== "resizer" &&
                                    !snapshot.isDragging
                                  ) {
                                    props.onClick(e);
                                  }
                                }}
                              >
                                {heading}
                                <div
                                  id="resizer"
                                  {...column.getResizerProps()}
                                  className={`resizer ${
                                    column.isResizing ? "isResizing" : ""
                                  }`}
                                  onMouseDown={(e) => {
                                    column.getResizerProps().onMouseDown(e);
                                    setResizing(true);
                                  }}
                                />
                              </div>
                              {column.canFilter ? (
                                <div className="filter">
                                  {column.render("Filter")}
                                </div>
                              ) : null}
                              {droppableProvided.placeholder}
                            </div>
                          </>
                        );
                      }}
                    </Draggable>
                  );
                })}
              </div>
            )}
          </Droppable>
        );
      })}
    </div>
  );
}
