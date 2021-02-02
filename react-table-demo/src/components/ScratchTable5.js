import React, { useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import {
  useTable,
  useAbsoluteLayout,
  useColumnOrder,
  usePagination,
  useSortBy,
} from "react-table";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import Pagination from "./Pagination";

const Styles = styled.div`
  padding: 1rem;

  * {
    box-sizing: border-box;
  }

  .table {
    border: 1px solid #000;
    /* max-width: 700px; */
    overflow-x: auto;
  }

  .header {
    font-weight: bold;
  }

  .rows {
    overflow-y: auto;
  }

  .row {
    border-bottom: 1px solid #000;
    height: 200px;

    &.body {
      :last-child {
        border: 0;
      }
    }
  }

  .cell {
    height: 100%;
    line-height: 31px;
    border-right: 1px solid #000;
    /* padding-left: 5px; */

    :last-child {
      border: 0;
    }
  }
`;

const getItemStyle = ({ isDragging, isDropAnimating }, draggableStyle) => ({
  ...draggableStyle,
  // some basic styles to make the items look a bit nicer
  userSelect: "none",

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "grey",

  ...(!isDragging && { transform: "translate(0,0)" }),
  ...(isDropAnimating && { transitionDuration: "0.001s" }),

  // styles we need to apply on draggables
});

function Table({ columns, data }) {
  // Use the state and functions returned from useTable to build your UI

  const defaultColumn = React.useMemo(
    () => ({
      width: 200,
    }),
    []
  );

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
    },
    useColumnOrder,
    useAbsoluteLayout,
    useSortBy,
    usePagination
  );

  const currentColOrder = React.useRef();
  console.log(allColumns);

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
        <div>
          {headerGroups.map((headerGroup, idx) => (
            <DragDropContext
              key={idx}
              onDragStart={() => {
                currentColOrder.current = allColumns.map((o) => o.id);
              }}
              onDragUpdate={(dragUpdateObj, b) => {
                // console.log("onDragUpdate", dragUpdateObj, b);

                const colOrder = [...currentColOrder.current];
                const sIndex = dragUpdateObj.source.index;
                const dIndex =
                  dragUpdateObj.destination && dragUpdateObj.destination.index;

                if (typeof sIndex === "number" && typeof dIndex === "number") {
                  colOrder.splice(sIndex, 1);
                  colOrder.splice(dIndex, 0, dragUpdateObj.draggableId);
                  setColumnOrder(colOrder);

                  // console.log(
                  //   "onDragUpdate",
                  //   dragUpdateObj.destination.index,
                  //   dragUpdateObj.source.index
                  // );
                  // console.log(temp);
                }
              }}
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
                      return (
                        <Draggable
                          key={column.id}
                          draggableId={column.id}
                          index={index}
                          isDragDisabled={!column.accessor}
                        >
                          {(provided, snapshot) => {
                            // console.log(column.getHeaderProps());

                            // const {
                            //   style,
                            //   ...extraProps
                            // } = column.getHeaderProps();

                            // console.log(style, extraProps);

                            return (
                              <div
                                {...props}
                                // className="cell header"
                                className={
                                  "cell header" &&
                                  (column.isSorted
                                    ? column.isSortedDesc
                                      ? "descSort"
                                      : "ascSort"
                                    : "")
                                }
                                // {...column.getHeaderProps(column.getSortByToggleProps())}
                                onClick={(e) => {
                                  // setShowModal(true);
                                  props.onClick(e);
                                  // TODO: find a way to remove modal after sorting complete
                                  // setTimeout(setShowModal(false), 1000);
                                }}
                              >
                                <div
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  // {...extraProps}
                                  ref={provided.innerRef}
                                  style={{
                                    ...getItemStyle(
                                      snapshot,
                                      provided.draggableProps.style
                                    ),
                                    // ...style
                                  }}
                                >
                                  {column.render("Header")}
                                </div>
                              </div>
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

        <div className="rows" {...getTableBodyProps()}>
          {page.map(
            (row, i) =>
              prepareRow(row) || (
                <div {...row.getRowProps()} className="row body" key={i}>
                  {row.cells.map((cell, idx) => {
                    return (
                      <div {...cell.getCellProps()} className="cell" key={idx}>
                        {cell.render("Cell")}
                      </div>
                    );
                  })}
                </div>
              )
          )}
        </div>
      </div>
      {/* <pre>
        <code>{JSON.stringify(state, null, 2)}</code>
      </pre> */}
      <Pagination paginationProps={paginationProps} />
    </>
  );
}

function App() {
  const [tableData, setTableData] = useState([]);
  // const [headings, setHeadings] = useState([]);

  // load initial data.
  useEffect(() => {
    async function getData() {
      // we can only fetch 1000 entries at a time.
      // there are exactly 26,000 entries
      // TODO: change skip to <= 25000 and change if statement
      // 	set to 1000 for now so we don't hammer db with requests
      // 	if statement to eliminate regrabbing same data on page refresh
      // if (tableData.length < 1) {
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
      // }
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

  // const columns = React.useMemo(
  //   () => [
  //     {
  //       Header: "Name",
  //       columns: [
  //         {
  //           Header: "First Name",
  //           accessor: "firstName",
  //         },
  //         {
  //           Header: "Last Name",
  //           accessor: "lastName",
  //         },
  //       ],
  //     },
  //     {
  //       Header: "Info",
  //       columns: [
  //         {
  //           Header: "Age",
  //           accessor: "age",
  //           width: 50,
  //         },
  //         {
  //           Header: "Visits",
  //           accessor: "visits",
  //           width: 60,
  //         },
  //         {
  //           Header: "Status",
  //           accessor: "status",
  //         },
  //         {
  //           Header: "Profile Progress",
  //           accessor: "progress",
  //         },
  //       ],
  //     },
  //   ],
  //   []
  // );

  // const data = React.useMemo(() => makeData(10), []);

  return (
    <Styles>
      <Table columns={columns} data={data} />
    </Styles>
  );
}

export default App;
