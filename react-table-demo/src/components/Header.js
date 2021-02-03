import React, { useRef, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export default function HeaderComp({ headerProps }) {
  const { setColumnOrder, headerGroups, allColumns } = headerProps;
  const currentColOrder = useRef();
  const [resizing, setResizing] = useState(false);
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
    <div>
      {headerGroups.map((headerGroup, idx) => (
        <DragDropContext
          key={idx}
          onDragStart={handleDragStart}
          onDragUpdate={handleDragUpdate}
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
                  // console.log(
                  //   "accessor: ",
                  //   column.accessor,
                  //   "isResizing: ",
                  //   column.isResizing,
                  //   "dragDisabled?: ",
                  //   !(column.accessor && !column.isResizing)
                  // );
                  return (
                    <Draggable
                      key={column.id}
                      draggableId={column.id}
                      index={index}
                      // isDragDisabled={!(column.accessor && !column.isResizing)}
                      isDragDisabled={!(column.accessor && !resizing)}
                      // isDragDisabled={!column.accessor}
                    >
                      {(provided, snapshot) => {
                        // console.log(column.getHeaderProps());
                        // const {
                        //   style,
                        //   ...extraProps
                        // } = column.getHeaderProps();
                        // console.log(style, extraProps);
                        const dragProps = column.isResizing
                          ? null
                          : {
                              ...provided.draggableProps,
                              ...provided.dragHandleProps,
                            };
                        // console.log("draggable: ", provided.draggableProps);
                        // console.log("dragHandle: ", provided.dragHandleProps);
                        return (
                          <div
                            {...props}
                            className={`cell header
														${column.isSorted ? (column.isSortedDesc ? "descSort" : "ascSort") : "noSort"}`}
                            // {...column.getHeaderProps(column.getSortByToggleProps())}
                            onClick={(e) => {
                              // check that column sort click handler exists before calling it - top row of headers do NOT have onClick - only second row
                              // resizing conditional and target id check prevents resorting while resizing
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
                            // >
                            //   <div
                            // {...extraProps}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              ...getItemStyle(
                                snapshot,
                                provided.draggableProps.style,
                                column
                              ),
                              ...props.style,
                            }}
                            // {...dragProps}
                          >
                            {column.render("Header")}
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
                                e.preventDefault();
                                setResizing(true);
                              }}
                              // not guaranteed to hit onMouseUp event...
                              // if we miss mouseup event, then resizing remains as true and drag disabled.
                              onMouseUp={(e) => {
                                console.log(
                                  "hits resizer up click. e: ",
                                  e,
                                  "target: ",
                                  e.target
                                );
                                setResizing(false);
                                e.preventDefault();
                              }}
                            />
                          </div>
                          // </div>
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
  );
}
