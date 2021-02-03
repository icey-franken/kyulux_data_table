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

  // there are styling conflicts with dnd and other components - one way to reset these is to slightly wiggle the screen. This function does that, without the user noticing anything.
  const wiggleScreen = () => {
    window.scrollTo({ top: 100, behavior: "auto" });
    window.scrollTo({ top: 0, behavior: "auto" });
    // console.log('screen wiggled')
  };

  const getItemStyle = (snapshot, draggableStyle, column) => {
    wiggleScreen();
    // console.log("snapshot before: ", snapshot);
    // if (column.Header==='Gender' && snapshot.isDropAnimating) {
		// 	snapshot.isDragging = false;
    // }
    // console.log("snapshot after: ", snapshot);

		const { isDragging, isDropAnimating } = snapshot;
		const { isResizing } = column;
    // console.log("isResizing?: ", isResizing);
    if (column.Header === "Gender") {
      console.log(
        "---------------get item style for Gender: \n",
        "draggableStyle",
        draggableStyle,
        "isDragging",
        isDragging,
        "isDropAnimating",
        isDropAnimating
      );
    }
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
          // suggested to move draggable style to the end so last applied
          ...draggableStyle,
          transform: null,
          // position: isDragging ? "absolute" : "relative",
          // some basic styles to make the items look a bit nicer
          // prevent highlighting
          userSelect: "none",
          // change background colour if dragging
          //TODO: add a delay to avoid quick switch to green when resizing
          background: isDragging ? "grey" : "initial",
          // ...(!isDragging && { transform: "translate(0,0)" }),
          ...(isDropAnimating && { transitionDuration: "0.001s" }),

          // styles we need to apply on draggables

          pointerEvents: "auto",
          touchAction: "none",

          ...posStyle,
        };
    if (column.Header === "gender") {
      console.log("item style: ", itemStyle);
    }
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

  const handleDragStart = (dragStartObj) => {
    // console.log(allColumns[dragStartObj.source.index].isResizing);
		// only change order if column is NOT being resized
		console.log('hits handle drag start')
    if (!allColumns[dragStartObj.source.index].isResizing && !resizing) {
      currentColOrder.current = allColumns.map((o) => o.id);
    }
  };

  const handleDragUpdate = (dragUpdateObj, b) => {
		// console.log(dragUpdateObj, b);
		console.log('hits handle drag update')
    if (!allColumns[dragUpdateObj.source.index].isResizing && !resizing) {
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
	const handleDragEnd = (e)=>{
		console.log('hits handle drag end in draggable - e: ', e)
	}

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
						onDragEnd={handleDragEnd}
            // onDragEnd={(e) => {
            //   console.log("drag end event: ", e);
            // }}
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
                    // console.log("e from mouse up in parent: ", e);
                    setResizing(false);
                  }}
                >
                  {headerGroup.headers.map((column, col_idx) => {
                    const props = column.getHeaderProps(
                      column.getSortByToggleProps()
                    );
                    if (column.id === "report_number") {
                      console.log(
                        "----------start report number\n",
                        "column.isResizing: ",
                        column.isResizing,
                        "resizing: ",
                        resizing,
                        "old isDragDisabled: ",
                        !(column.accessor && !column.isResizing && !resizing)
                      );
										}
										console.log(column, hg_idx, 'drag disabled? :', col_idx === 0|| !(column.accessor && !column.isResizing && !resizing))
										console.log(hg_idx, hg_idx === 0, !!column.accessor, !column.isResizing, !resizing, 'total: ', hg_idx === 0|| !(column.accessor && !column.isResizing && !resizing))
                    return (
                      <Draggable
                        key={column.id}
                        draggableId={column.id}
												index={col_idx}
												// only allows dragging of second header row - adjust later to allow both rows to be dragged IFF you can get it to behave - consider using indexes instead of whatever you currently use
                        isDragDisabled={
                          hg_idx === 0|| !(column.accessor && !column.isResizing && !resizing)
                        }
                        // isDragDisabled={false}
                        // disabled={false}
                        onDragEnd={(e) => {
                          console.log("drag end event: ", e);
                        }}
                      >
                        {(draggableProvided, snapshot) => {
                          // console.log(column.getHeaderProps());
                          // const {
                          //   style,
                          //   ...extraProps
                          // } = column.getHeaderProps();
                          // console.log(style, extraProps);
                          const dragProps = resizing
                            ? null
                            : {
                                ...draggableProvided.draggableProps,
                                ...draggableProvided.dragHandleProps,
                              };
                          const heading = column.render("Header");
                          draggableProvided.draggableProps.onTransitionEnd = (
                            e
                          ) => {
                            console.log(
                              "on transition end event: ",
                              e,
                              "target",
                              e.target
                            );
                          };
                          // console.log(
                          //   "draggableProvided:",
                          //   draggableProvided,
                          //   "snapshot: ",
                          //   snapshot
                          // );
                          // console.log("drag props: ", dragProps);
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
                                // !!! move to higher component
                                onMouseUp={(e) => {
                                  // console.log(e);
                                  // console.log(e.target);
                                  // console.log(e.target.style);
                                }}
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
          </DragDropContext>
        ))}
      </div>
    </>
  );
}
