import React, { useRef, useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export default function HeaderComp({ headerProps }) {
  const {
    setColumnOrder,
    headerGroups,
    allColumns,
    visibleColumns,
    preGlobalFilteredRows,
    globalFilter,
    setGlobalFilter,
    GlobalFilter,
  } = headerProps;
  const currentColOrder = useRef();
  const [resizing, setResizing] = useState(false);
  // useEffect(() => {
  // 	console.log('hits use effect. Resizing: ', resizing)
  // 	if (resizing) {
  //     return setTimeout(setResizing(false), 5000);
  //   }
  // }, [resizing]);
  // ---------------------------------------
  const getItemStyle = (snapshot, draggableStyle, column) => {
    // console.log(snapshot, column);
    const { isDragging, isDropAnimating } = snapshot;
    const { isResizing } = column;
    // console.log("isResizing?: ", isResizing);
    const itemStyle = isResizing
      ? { background: "grey" }
      : {
          ...draggableStyle,
          // some basic styles to make the items look a bit nicer
          userSelect: "none",

          // change background colour if dragging
          //TODO: add a delay to avoid quick switch to green when resizing
          background: isDragging ? "lightgreen" : "initial",

          // ...(!isDragging && { transform: "translate(0,0)" }),
          ...(isDropAnimating && { transitionDuration: "0.001s" }),

          // styles we need to apply on draggables
        };
    // console.log(itemStyle);
    return itemStyle;
  };

  // const getItemStyle = ({ isDragging, isDropAnimating }, draggableStyle) => ({
  //   ...draggableStyle,
  //   // some basic styles to make the items look a bit nicer
  //   userSelect: "none",

  //   // change background colour if dragging
  //   background: isDragging ? "lightgreen" : "grey",

  //   ...(!isDragging && { transform: "translate(0,0)" }),
  //   ...(isDropAnimating && { transitionDuration: "0.001s" }),

  //   // styles we need to apply on draggables
  // });
  // ---------------------------------------

  const handleDragStart = (dragStartObj) => {
    // console.log(allColumns[dragStartObj.source.index].isResizing);
    // only change order if column is NOT being resized
    // if (!allColumns[dragStartObj.source.index].isResizing) {
    currentColOrder.current = allColumns.map((o) => o.id);
    // }
  };

  const handleDragUpdate = (dragUpdateObj, b) => {
    // console.log(dragUpdateObj, b);
    if (!allColumns[dragUpdateObj.source.index].isResizing) {
      const colOrder = [...currentColOrder.current];
      const sIndex = dragUpdateObj.source.index;
      const dIndex =
        dragUpdateObj.destination && dragUpdateObj.destination.index;
      if (typeof sIndex === "number" && typeof dIndex === "number") {
        colOrder.splice(sIndex, 1);
        colOrder.splice(dIndex, 0, dragUpdateObj.draggableId);
        setColumnOrder(colOrder);
      }
    }
  };

  return (
    <>
      {/* idea is to have a parent element that covers entire screen with mouseup event handler - to ensure resizing doesn't get stuck on true if user moves mouse before unclicking */}
      {/* <div
        style={{
          visibility: "hidden",
          zIndex: "-5",
          backgroundColor: "rgba(0,0,200,0.4)",
          position: "absolute",
          top: "-1000px",
          left: "-1000px",
          width: "99999px",
          height: "99999px",
        }}
        onMouseUp={(e) => {
          console.log("hits huge div", e);
          setResizing(false);
        }}
      ></div> */}
      <div>
        <div>
          <div
            colSpan={visibleColumns.length}
            style={{
              textAlign: "left",
            }}
          >
            <GlobalFilter
              preGlobalFilteredRows={preGlobalFilteredRows}
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
            />
          </div>
        </div>
        {headerGroups.map((headerGroup, hg_idx) => (
          <DragDropContext
            key={hg_idx}
            onDragStart={handleDragStart}
            onDragUpdate={handleDragUpdate}
          >
            <Droppable droppableId="droppable" direction="horizontal">
              {(droppableProvided, snapshot) => (
                <div
                  {...headerGroup.getHeaderGroupProps()}
                  ref={droppableProvided.innerRef}
                  // below doesn't work because we have a single dropzone - I was attempting to highlight individual drop zones. It is possible, but a lot more work and not worth it at this point
                  // className={`row header-group
                  // ${snapshot.isDraggingOver ? "current-dropzone" : ""}`}
                  className={`row header-group ${
                    hg_idx === 1 ? "header-group-search" : ""
                  }`}
                  // this prevents resizing being left as true - if user tries to drag and it doesn't work, release of click will set resizing to false and allow drag
                  onMouseUp={(e) => {
                    console.log("e from mouse up in parent: ", e);
                    setResizing(false);
                  }}
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
                        // isDragDisabled={!column.accessor}
                      >
                        {(provided, snapshot) => {
                          // console.log(column.getHeaderProps());
                          // const {
                          //   style,
                          //   ...extraProps
                          // } = column.getHeaderProps();
                          // console.log(style, extraProps);
                          const dragProps = resizing
                            ? null
                            : {
                                ...provided.draggableProps,
                                ...provided.dragHandleProps,
                              };
                          const heading = column.render("Header");
                          return (
                            <>
                              <div
                                {...props}
                                className={`cell header`}
                                // ${column.isSorted ? (column.isSortedDesc ? "descSort" : "ascSort") : "noSort"}`}

                                // {...column.getHeaderProps(column.getSortByToggleProps())}

                                // >
                                //   <div
                                // {...extraProps}
                                ref={provided.innerRef}
                                {...dragProps}
                                // {...provided.draggableProps}
                                // {...provided.dragHandleProps}
                                style={{
                                  ...getItemStyle(
                                    snapshot,
                                    provided.draggableProps.style,
                                    column
                                  ),
                                  ...props.style,
                                  // height: (hg_idx === 1 ? '300px': 'inherit')
                                }}
                                // {...dragProps}
                                // spreading props above spreads a click handler in here. We remove it by setting it to null. Click handler from props moved to div below so that clicking in search bar does not trigger a sort
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
                                    // check that column sort click handler exists before calling it - top row of headers do NOT have onClick - only second row
                                    // resizing conditional and target id check prevents resorting while resizing
                                    console.log(
                                      "e.target from click",
                                      e.target
                                    );
                                    if (
                                      typeof props.onClick === "function" &&
                                      !resizing &&
                                      e.target.id !== "resizer"
                                    ) {
                                      props.onClick(e);
                                    }
                                    // TODO: add loading modal while sorting
                                    // TODO: find a way to remove modal after sorting complete
                                  }}
                                >
                                  {/* {column.render("Header")} */}
                                  {heading}
                                  {/* conditional rendering of resizing tab */}
                                  {typeof heading === "string" ? (
                                    <div
                                      id="resizer"
                                      {...column.getResizerProps()}
                                      className={`resizer ${
                                        column.isResizing ? "isResizing" : ""
                                      }`}
                                      onMouseDown={(e) => {
                                        column.getResizerProps().onMouseDown(e);
                                        console.log(
                                          "hits resizer down click. e: ",
                                          e,
                                          "target: ",
                                          e.target
                                        );
                                        // e.preventDefault();
                                        setResizing(true);
                                      }}
                                      // not guaranteed to hit onMouseUp event...
                                      // if we miss mouseup event, then resizing remains as true and drag disabled.
                                      // band-aid solution is useEffect above with setTimeout
                                      // moved this to parent element (header row) for greater chance of being hit.
                                      // onMouseUp={(e) => {
                                      //   console.log(
                                      //     "hits resizer up click. e: ",
                                      //     e,
                                      //     "target: ",
                                      //     e.target
                                      //   );
                                      //   setResizing(false);
                                      //   e.preventDefault();
                                      // }}
                                    />
                                  ) : null}
                                  {/* // </div> */}
                                  {/* // !!! */}
                                </div>
                                {hg_idx === 1 && column.canFilter ? (
                                  <div className="filter">
                                    {column.render("Filter")}
                                  </div>
                                ) : null}
                                {/* // -!!! */}
                              </div>
                            </>
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
    </>
  );
}
