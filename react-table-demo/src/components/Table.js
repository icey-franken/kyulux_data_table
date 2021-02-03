import React, { useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import {
  useTable,
  useAbsoluteLayout,
  useColumnOrder,
  usePagination,
  useResizeColumns,
  useBlockLayout,
  useFilters,
  useGlobalFilter,
  useSortBy,
} from "react-table";

import Header from "./Header";
import Body from "./Body";
import Pagination from "./Pagination";

// !!! can live elsewhere
const DefaultColumnFilter = ({
  column: { filterValue, preFilteredRows, setFilter },
}) => {
  const count = preFilteredRows.length;

  return (
    <input
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
      placeholder={`Search ${count} records...`}
    />
  );
};

const GlobalFilter = ({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) => {
  const count = preGlobalFilteredRows && preGlobalFilteredRows.length;

  return (
    <span>
      Search:{" "}
      <input
        value={globalFilter || ""}
        onChange={(e) => {
          setGlobalFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
        }}
        placeholder={`${count} records...`}
        style={{
          border: "0",
        }}
      />
    </span>
  );
};
// -!!!

// here we create the table
export default function Table({ columns, data }) {
  // Use the state and functions returned from useTable to build your UI

  // const defaultColumn = useMemo(() => ({ width: 200 }), []);
  // !!! should live here
  const defaultColumn = React.useMemo(
    () => ({
      Filter: DefaultColumnFilter,
      width: 200,
    }),
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
                .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      },
    }),
    []
  );
  // -!!!

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
    // !!!
    visibleColumns,
    preGlobalFilteredRows,
    setGlobalFilter,
    // -!!!
  } = useTable(
    {
      columns,
      data,
      // defaultColumn,
      initialState: { pageSize: 10 },
      autoResetPage: false,
      // className: '-striped -highlight'
      // !!!
      defaultColumn,
      filterTypes,
      // -!!!
    },
    useColumnOrder,
    // useAbsoluteLayout,
    useBlockLayout,
    useResizeColumns,
    // !!!
    useFilters,
    useGlobalFilter,
    // -!!!
    useSortBy,
    usePagination
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
