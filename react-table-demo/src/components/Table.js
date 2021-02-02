import React, { useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import {
  useTable,
  useAbsoluteLayout,
  useColumnOrder,
  usePagination,
  useSortBy,
  useResizeColumns,
  useBlockLayout,
} from "react-table";

import Header from "./Header";
import Body from "./Body";
import Pagination from "./Pagination";

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
    // useAbsoluteLayout,
    useBlockLayout,
    useSortBy,
    usePagination,
    useResizeColumns
  );

  const headerProps = { setColumnOrder, headerGroups, allColumns };
  const bodyProps = { getTableBodyProps, prepareRow, page };
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
