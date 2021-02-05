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

  // define our basic text filter
  const filterTypes = useMemo(
    () => ({
      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .includes(String(filterValue).toLowerCase())
            : false;
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
    window.scrollBy(1, 1);
    window.scrollBy(-1, -1);
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
    }
  };

  const handleDragStart = (dragStartObj) => {
    // only allow drag if not resizing
    if (!allColumns[dragStartObj.source.index].isResizing) {
      currentColOrder.current = allColumns.map((o) => o.id);
    }
  };

  const handleDragUpdate = (dragUpdateObj, b) => {
    // only allow drag if not resizing. Also check that currentColOrder.current is an array, otherwise app will crash (bug).
    if (
      !allColumns[dragUpdateObj.source.index].isResizing &&
      Array.isArray(currentColOrder.current)
    ) {
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

  const handleDragEnd = (e) => {
    // react-beautiful-dnd is buggy when integrated with react-table.
    // slightly moving scroll position (wiggleScreen) fixes these styling bugs.
    // wiggling screen asynchronously gives better results
    setTimeout(() => wiggleScreen(), 1);
  };

  // prepare props for table components
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
        onDragEnd={handleDragEnd}
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
