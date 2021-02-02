// filtering start https://blog.logrocket.com/building-styling-tables-react-table-v7/#filtering
// freeze header pane https://codesandbox.io/s/k9n3y82wov


import React, { useEffect, useState, useMemo } from "react";
import Table from "./Table";
import styled from "styled-components";

const Styles = styled.div`
  padding: 1rem;

  * {
    box-sizing: border-box;
    text-align: center;
  }

  .table {
    /* border: 1px solid #000; */
    /* max-width: 700px; */
    overflow-x: auto;
    /* overflow-x: hidden; */
  }

  .header {
    font-weight: 600;
  }

  .rows {
    /* overflow-y: hidden;
    overflow-x: hidden; */
  }

  .row {
    /* border-bottom: 1px solid #000; */
    height: 200px;

    &.body {
      :last-child {
        border: 0;
      }
    }
  }

  .header-group {
		height: 20px;
		white-space: nowrap;
		display: inline-block;
    /* margin: 10px!important; */
  }

  .row.body:hover {
    background-color: rgb(250, 100, 100) !important;
  }

  .cell {
    height: 100%;
    /* line-height: 31px; */
    border-right: 1px solid #000;
    /* padding-left: 5px; */

    :last-child {
      border: 0;
    }

    .resizer {
      display: inline-block;
      background: blue;
      width: 10px;
      height: 100%;
      position: absolute;
      right: 0;
      top: 0;
      transform: translateX(50%);
      z-index: 1;
      ${"" /* prevents from scrolling while dragging on touch devices */}
      touch-action:none;

      &.isResizing {
        background: red;
      }
    }
  }
`;

export default function TableContainer() {
  const [tableData, setTableData] = useState([]);
  // load initial data.
  useEffect(() => {
    async function getData() {
      // we can only fetch 1000 entries at a time - there are exactly 26,000 entries
      // TODO: change skip to <= 25000 and change if statement
      // 	set to 1000 for now so we don't hammer db with requests
      // 	if statement to eliminate regrabbing same data on page refresh
      if (tableData.length < 1) {
        for (let skip = 0; skip <= 1000; skip += 1000) {
          const res = await fetch(
            `https://api.fda.gov/food/event.json?limit=1000&skip=${skip}`
          );
          const { results } = await res.json();
          setTableData((tableData) => [...tableData, ...results]);
        }
      }
    }
    getData();
  }, []);

  const getColumnWidth = (rows, accessor, headerText) => {
    // pass in page, NOT rows - rows too much data and no benefit
    const maxWidth = 400;
    const magicSpacing = 10;
    console.log(rows);
    const rowLenArr = rows.map((row) => {
      console.log(`${row[accessor]}` || "");
      return (`${row[accessor]}` || "").length;
    });
    const potentialLenArr = [...rowLenArr, headerText.length];
    const cellLength = Math.max(...potentialLenArr);
    const result = Math.min(maxWidth, cellLength * magicSpacing);
    console.log(
      "accessor:",
      accessor,
      "headerText.length: ",
      headerText.length,
      "cellLength: ",
      cellLength,
      "result: ",
      result
    );
    return result;
  };

  // const getColumnWidthOriginal = (rows, accessor, headerText) => {
  //   const maxWidth = 400;
  //   const magicSpacing = 10;
  //   const cellLength = Math.max(
  //     ...rows.map((row) => (`${row[accessor]}` || "").length),
  //     headerText.length
  //   );
  //   return Math.min(maxWidth, cellLength * magicSpacing);
  // };

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
        Header: "Report Number",
        accessor: "report_number",
        width: 126,
      },
      {
        Header: "Consumer",
        columns: [
          {
            Header: "Age",
            accessor: "consumer.age",
            Cell: ({ cell: { value } }) => (
              <span style={{ color: "red" }}>{value}</span>
            ),
            width: 40,
          },
          {
            Header: "Age Unit",
            accessor: "consumer.age_unit",
            width: 80,
          },
          {
            Header: "Gender",
            accessor: "consumer.gender",
            width: 66,
          },
				],
      },
      {
        Header: "Date Created",
        accessor: "date_created",
        width: 110,
      },
      {
        Header: "Date Started",
        accessor: "date_started",
        width: 104,
      },
      {
        Header: "Outcomes",
        accessor: "outcomes",
        // width: 200,
        // width: getColumnWidth(data, "outcomes", "Outcomes"),
      },
      {
        Header: "Products",
        columns: [
          {
            Header: "Industry Code",
            accessor: "products.industry_code",
            width: 114,
          },
          {
            Header: "Industry Name",
            accessor: "products.industry_name",
            // width: getColumnWidth(
            //   data,
            //   "products.industry_name",
            //   "Industry Name"
            // ),
            width: 200,
          },
          {
            Header: "Name Brand",
            accessor: "products.name_brand",
            // width: getColumnWidth(data, "products.name_brand", "Name Brand"),
            width: 200,
          },
          {
            Header: "Role",
            accessor: "products.role",
            width: 100,
          },
        ],
      },
      {
        Header: "Reactions",
        accessor: "reactions",
        // width: getColumnWidth(data, "reactions", "Reactions"),
      },
    ],
    []
  );

  return (
    <Styles>
      <Table columns={columns} data={data} />
    </Styles>
  );
}
