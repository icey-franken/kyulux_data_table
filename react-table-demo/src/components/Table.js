import React, { useEffect, useState, useMemo } from "react";
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
import { DefaultColumnFilter, GlobalFilter } from "./Filters";

import Header from "./Header";
import Body from "./Body";
import Pagination from "./Pagination";

// here we create the table
export default function Table({ columns, data }) {
  // Use the state and functions returned from useTable to build your UI

  const defaultColumn = useMemo(
    () => ({ Filter: DefaultColumnFilter, width: 200 }),
    []
  );

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
      initialState: { pageSize: 10 },
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

  const headerProps = {
    setColumnOrder,
    headerGroups,
    allColumns,
    visibleColumns,
    preGlobalFilteredRows,
    globalFilter: state.globalFilter,
    setGlobalFilter,
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
      <div {...getTableProps()} className="table">
        <Header headerProps={headerProps} />
        <Body bodyProps={bodyProps} />
      </div>
      <Pagination paginationProps={paginationProps} />
    </>
  );
}
