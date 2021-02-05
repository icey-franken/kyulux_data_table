import React, { useRef, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { GlobalFilter } from "./Filters";

export default function HeaderComp({ headerProps }) {
  const {
    setColumnOrder,
    headerGroups,
    allColumns,
    visibleColumns,
    preGlobalFilteredRows,
    globalFilter,
    setGlobalFilter,
    wiggleScreen,
    handleDragEnd,
  } = headerProps;
  // !!! uncomment after app test
  // const currentColOrder = useRef();
  const [resizing, setResizing] = useState(false);
  // useEffect(() => {
  // 	console.log('hits use effect. Resizing: ', resizing)
  // 	if (resizing) {
  //     return setTimeout(setResizing(false), 5000);
  //   }
  // }, [resizing]);
  // ---------------------------------------

  const getItemStyle = (snapshot, draggableStyle, column) => {
    // wiggleScreen();
    // console.log("snapshot before: ", snapshot);
    // if (column.Header==='Gender' && snapshot.isDropAnimating) {
    // 	snapshot.isDragging = false;
    // }
    // console.log("snapshot after: ", snapshot);

    const { isDragging, isDropAnimating } = snapshot;
    const { isResizing } = column;
    // console.log("isResizing?: ", isResizing);
    // if (column.Header === "Gender") {
    //   console.log(
    //     "---------------get item style for Gender: \n",
    //     "draggableStyle",
    //     draggableStyle,
    //     "isDragging",
    //     isDragging,
    //     "isDropAnimating",
    //     isDropAnimating
    //   );
    // }
    const posStyle =
      isDragging && !isDropAnimating
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
          };

    const itemStyle = isResizing
      ? { background: "grey" }
      : {
          // position: isDragging ? "absolute" : "relative",
          // some basic styles to make the items look a bit nicer
          // prevent highlighting
          userSelect: "none",
          // change background colour if dragging
          //TODO: add a delay to avoid quick switch to green when resizing
          background: isDragging ? "grey" : "initial",
          // ...(!isDragging && { transform: "translate(0,0)" }),
          // styles we need to apply on draggables

          // suggested to move draggable style to the end so last applied
          ...draggableStyle,
          ...(isDropAnimating && { transitionDuration: "0.001s" }),
          pointerEvents: "auto",
          touchAction: "none",
          transform: null,
          ...posStyle,
        };
    // if (column.Header === "Gender") {
    //   console.log("item style: ", itemStyle);
    // }
    return itemStyle;
  };

  // Original getItemStyle function
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

  return (
    <div className='sticky-header'>
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
                className={`row header-group ${
                  hg_idx === 1 ? "header-group-search" : ""
                }`}
                // this prevents resizing being left as true - if user tries to drag and it doesn't work, release of click will set resizing to false and allow drag
                onMouseUp={(e) => {
                  // console.log("e from mouse up in parent: ", e);
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
                      draggableId={hg_idx === 1 ? column.id : null}
                      index={col_idx}
                      // only allows dragging of second header row - adjust later to allow both rows to be dragged IFF you can get it to behave - consider using indexes instead of whatever you currently use
                      isDragDisabled={
                        hg_idx === 0 ||
                        !(column.accessor && !column.isResizing && !resizing)
                      }
                      onDragEnd={(e) => {
                        console.log(
                          "drag end event from draggable - remove?: ",
                          e
                        );
                        handleDragEnd();
                      }}
                    >
                      {(draggableProvided, snapshot) => {
                        const heading = column.render("Header");
                        return (
                          <>
                            {/* {draggableProvided.placeHolder} */}
                            <div
                              {...props}
                              className={`cell header`}
                              ref={draggableProvided.innerRef}
                              // {...dragProps}
                              {...draggableProvided.draggableProps}
                              {...draggableProvided.dragHandleProps}
                              style={{
                                ...getItemStyle(
                                  snapshot,
                                  draggableProvided.draggableProps.style,
                                  column
                                ),
                                ...props.style,
                              }}
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
                                  // console.log(
                                  //   "e.target from click",
                                  //   e.target
                                  // );
                                  // !!! isDragging is not updating properly - onDragEnd not being called?
                                  console.log(
                                    "isdraggin?",
                                    snapshot.isDragging,
                                    snapshot
                                  );
                                  if (
                                    typeof props.onClick === "function" &&
                                    !resizing &&
                                    e.target.id !== "resizer" &&
                                    !snapshot.isDragging
                                  ) {
                                    props.onClick(e);
                                  }
                                  // TODO: add loading modal while sorting
                                  // TODO: find a way to remove modal after sorting complete
                                }}
                              >
                                {heading}
                                {/* conditional rendering of resizing tab - unnecessary if we only render secondary headings*/}
                                {typeof heading === "string" ? (
                                  <div
                                    id="resizer"
                                    {...column.getResizerProps()}
                                    className={`resizer ${
                                      column.isResizing ? "isResizing" : ""
                                    }`}
                                    onMouseDown={(e) => {
                                      column.getResizerProps().onMouseDown(e);
                                      // console.log(
                                      //   "hits resizer down click. e: ",
                                      //   e,
                                      //   "target: ",
                                      //   e.target
                                      // );
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
                              </div>
                              {hg_idx === 1 && column.canFilter ? (
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
          // </DragDropContext>
        );
      })}
    </div>
  );
}
