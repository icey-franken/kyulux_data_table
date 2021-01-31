import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { useTable, usePagination, useSortBy } from "react-table";
import SortingModal from "./SortingModal";

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }
`;

function Table({ columns, data }) {
  // Use the state and functions returned from useTable to build your UI

  const [showModal, setShowModal] = useState(false);

  const onSortingChange = (e) => {
    setShowModal(false);
  };

  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: { pageSize: 10 },
      autoResetPage: false,
      // manualPagination: true,
      onSortingChange,
    },
    useSortBy,
    usePagination
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    pageOptions,
    pageCount,
    page,
    state: { pageIndex, pageSize },
    gotoPage,
    previousPage,
    nextPage,
    setPageSize,
    canPreviousPage,
    canNextPage,
  } = tableInstance;
  // Render the UI for your table
  return (
    <div>
      <SortingModal showModal={showModal} />
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => {
            return (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => {
                  const props = column.getHeaderProps(
                    column.getSortByToggleProps()
                  );
                  return (
                    <th
                      className={
                        column.isSorted
                          ? column.isSortedDesc
                            ? "descSort"
                            : "ascSort"
                          : ""
                      }
                      {...props}
                      // {...column.getHeaderProps(column.getSortByToggleProps())}
                      onClick={(e) => {
                        setShowModal(true);
                        props.onClick(e);
                        // TODO: find a way to remove modal after sorting complete
                        setShowModal(false);
                      }}
                    >
                      <span>
                        {column.render("Header")}
                        {/* {column.isSorted
                        ? column.isSortedDesc
                          ? " ▼"
                          : " ▲"
                        : ""} */}
                      </span>
                    </th>
                  );
                })}
              </tr>
            );
          })}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      {/* pagination components */}
      {/* TODO: I want pagination component to remain in the center of the viewport */}
      <div className="pagination">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {"<<"}
        </button>{" "}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {"<"}
        </button>{" "}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {">"}
        </button>{" "}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {">>"}
        </button>{" "}
        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
        <span>
          | Go to page:{" "}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: "100px" }}
          />
        </span>{" "}
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function TableContainer() {
  const [tableData, setTableData] = useState([]);
  // const [headings, setHeadings] = useState([]);

  // load initial data.
  useEffect(() => {
    async function getData() {
      // we can only fetch 1000 entries at a time.
      // there are exactly 26,000 entries
      // TODO: change skip to <= 25000
      // 	set to 1000 for now so we don't hammer db with requests
      for (let skip = 0; skip <= 1000; skip += 1000) {
        const res = await fetch(
          `https://api.fda.gov/food/event.json?limit=1000&skip=${skip}`
        );
        const { results } = await res.json();
        console.log(results);
        // setTableData(results)
        // TODO: find way to stop page resetting to 1 each time results are added
        setTableData((tableData) => [...tableData, ...results]);
      }
    }
    getData();
  }, []);

  const data = useMemo(() => {
    const flatData = [];
    tableData.forEach((row) => {
      const subRow = row;
      // turn array of outcomes into ';' separated string
      if (Array.isArray(subRow.outcomes)) {
        subRow.outcomes = subRow.outcomes.join("; ");
      }

      // turn array of reactions into ';' separated string
      if (Array.isArray(subRow.reactions)) {
        subRow.reactions = subRow.reactions.join("; ");
      }

      //TODO: convert dates to common format

      // flatten products - multiple products may be responsible for the same adverse reaction. We include these as separate rows.
      if (Array.isArray(row.products)) {
        row.products.forEach((product) => {
          flatData.push({ ...subRow, products: product });
        });
      } else {
        flatData.push({ ...subRow });
      }
    });
    return flatData;
  }, [tableData]);

  const columns = useMemo(
    () => [
      {
        Header: "Consumer",
        columns: [
          {
            Header: "Age",
            accessor: "consumer.age",
            Cell: ({ cell: { value } }) => (
              <span style={{ color: "red" }}>{value}</span>
            ),
          },
          {
            Header: "Age Unit",
            accessor: "consumer.age_unit",
          },
          {
            Header: "Gender",
            accessor: "consumer.gender",
          },
        ],
      },
      { Header: "Date Created", accessor: "date_created" },
      { Header: "Date Started", accessor: "date_started" },
      { Header: "Outcomes", accessor: "outcomes" },
      {
        Header: "Products",
        columns: [
          { Header: "Industry Code", accessor: "products.industry_code" },
          { Header: "Industry Name", accessor: "products.industry_name" },
          { Header: "Name Brand", accessor: "products.name_brand" },
          { Header: "Role", accessor: "products.role" },
        ],
      },
      { Header: "Reactions", accessor: "reactions" },
      { Header: "Report Number", accessor: "report_number" },
    ],
    []
  );

  return (
    <Styles>
      <Table columns={columns} data={data} />
    </Styles>
  );
}

export default TableContainer;
