import React, { useMemo, useRef } from "react";
import {
  useTable,
  useColumnOrder,
  usePagination,
  useResizeColumns,
  useBlockLayout,
  useFilters,
  useGlobalFilter,
  useSortBy,
} from "react-table";
import { DragDropContext } from "react-beautiful-dnd";
import { DefaultColumnFilter } from "./Filters";
import Header from "./Header";
import Body from "./Body";
import Pagination from "./Pagination";

// here we create the table
export default function Table({ columns, data }) {
  const defaultColumn = useMemo(
    () => ({ Filter: DefaultColumnFilter, width: 200 }),
    []
  );

  // define our text filter
  const filterTypes = useMemo(
    () => ({
      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .includes(String(filterValue).toLowerCase())
            : true;
        });
      },
    }),
    []
  );

  // use props/functions returned from useTable to build UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    // rows, // use page instead - less data to load
    prepareRow,
    allColumns,
    setColumnOrder,
    state,
    pageOptions,
    pageCount,
    page,
    gotoPage,
    previousPage,
    nextPage,
    setPageSize,
    canPreviousPage,
    canNextPage,
    visibleColumns,
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageSize: 30 },
      autoResetPage: false,
      defaultColumn,
      filterTypes,
    },
    useColumnOrder,
    useBlockLayout,
    useResizeColumns,
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const currentColOrder = useRef();

  // there are styling conflicts with dnd and other components - one way to reset these is to slightly wiggle the screen. This function does that, without the user noticing anything. NOTE: this ONLY works if the screen is scrollable.
  const wiggleScreen = () => {
    // we don't care about wiggle room for window - we want to be at the top anyways. This will change once I get the sticky header working.
    window.scrollBy(1, 1);
    window.scrollBy(-1, -1);

    // window.scrollTo({ top: 100, behavior: "auto" });
    // window.scrollTo({ top: 0, behavior: "auto" });
    console.log("wiggles");
    const tableEl = document.querySelector(".table");
    if (tableEl) {
      // ensure that there is "room to wiggle" for table
      if (tableEl.scrollLeft === 0) {
        tableEl.scrollBy(1, 1);
        tableEl.scrollBy(-1, -1);
      } else {
        tableEl.scrollBy(-1, -1);
        tableEl.scrollBy(1, 1);
      }
      // tableEl.scrollTo({ left: 100, behavior: "auto" });
      // tableEl.scrollTo({ left: 10, behavior: "auto" });
    }
  };

  const handleDragStart = (dragStartObj) => {
    // console.log(allColumns[dragStartObj.source.index].isResizing);
    // only change order if column is NOT being resized
    console.log("hits handle drag start");
    if (!allColumns[dragStartObj.source.index].isResizing) {
      // && !resizing) {
      currentColOrder.current = allColumns.map((o) => o.id);
    }
  };

  const handleDragUpdate = (dragUpdateObj, b) => {
    // console.log(dragUpdateObj, b);
    console.log("hits handle drag update");
    if (!allColumns[dragUpdateObj.source.index].isResizing) {
      // && !resizing) {
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
    // wiggleScreen();
  };
  const handleDragEnd = (e) => {
    // console.log("hits handle drag end in draggable - e: ", e);
    // wiggleScreen();
    setTimeout(() => {
      console.log("timeout runs");
      wiggleScreen();
    }, 1);
  };

  // prepare props for main components - consider implementing table context
  const headerProps = {
    setColumnOrder,
    headerGroups,
    allColumns,
    visibleColumns,
    preGlobalFilteredRows,
    globalFilter: state.globalFilter,
    setGlobalFilter,
    wiggleScreen,
    handleDragEnd,
  };
  const bodyProps = { getTableBodyProps, prepareRow, page };

  const paginationProps = {
    pageIndex: state.pageIndex,
    pageSize: state.pageSize,
    pageOptions,
    pageCount,
    gotoPage,
    previousPage,
    nextPage,
    setPageSize,
    canPreviousPage,
    canNextPage,
  };

  return (
    <>
      <DragDropContext
        onDragStart={handleDragStart}
        onDragUpdate={handleDragUpdate}
        onDragEnd={(e) => {
          console.log("drag end event from dragdropcontext: ", e);
          handleDragEnd();
        }}
      >
        <div {...getTableProps()} onMouseUp={handleDragEnd} className="table">
          <Header headerProps={headerProps} />
          <Body bodyProps={bodyProps} />
        </div>
        <Pagination paginationProps={paginationProps} />
      </DragDropContext>
    </>
  );
}
