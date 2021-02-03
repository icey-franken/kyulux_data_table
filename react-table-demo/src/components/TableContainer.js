// filtering start https://blog.logrocket.com/building-styling-tables-react-table-v7/#filtering
// freeze header pane https://codesandbox.io/s/k9n3y82wov

// here we set up table structure, data, and styling
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
    height: 40px;
    /* 40px; */
    background-color: lightgrey;
    white-space: nowrap;
    display: inline-block;
    box-sizing: border-box;
    line-height: 30px;
    /* border: 1px solid green; */
    /* margin: 10px!important; */
	}

	.header-group-search {
		height: 80px!important;
	}

  .header.cell {
    /* border: 1px solid green; */
    height: 100%;
    border-top: 5px solid transparent;
    border-bottom: 5px solid transparent;
    overflow: hidden;
  }
  .header.cell:focus {
    outline: none;
  }
  .current-dropzone {
    opacity: 0.6;
  }
  .row.body:hover {
    background-color: rgb(250, 100, 100) !important;
  }

  .cell {
    height: 100%;
    /* line-height: 31px; */
    border-right: 1px solid #000;
    /* padding-left: 5px; */
    overflow-x: hidden;

    :last-child {
      border-right: 0;
    }
  }
  .resizer {
    display: inline-block;
    background: rgba(173, 216, 230, 0.7);
    width: 5px;
    height: 40px;
    position: absolute;
    right: 0;
    top: 0;
    /* transform: translateX(5px); */
    z-index: 1;
    overflow-x: visible !important;
    ${"" /* prevents from scrolling while dragging on touch devices */}
    touch-action:none;
    transition: width 0.5s;

    &.isResizing {
      background: rgba(173, 216, 230, 1);
    }
    &:hover {
      width: 10px;
      background: rgba(173, 216, 230, 1);

      /* transform: translateX(0); */
    }
  }

  /* !!! */
  .filter {
		/* width: 100%; */
		/* width: 100px; */
		cursor: default;
    /* height: 100%; */
    /* border: 4px solid purple; */
    box-sizing: border-box;
		z-index: 10;
		position: absolute;
		bottom: 0px;
		/* border: 1px solid blue; */
  }
  /* -!!! */
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
        filter: "text",
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
            filter: "text",
          },
          {
            Header: "Age Unit",
            accessor: "consumer.age_unit",
            width: 80,
            filter: "text",
          },
          {
            Header: "Gender",
            accessor: "consumer.gender",
            width: 66,
            filter: "text",
          },
        ],
      },
      {
        Header: "Date Created",
        accessor: "date_created",
        width: 110,
        filter: "text",
      },
      {
        Header: "Date Started",
        accessor: "date_started",
        width: 104,
        filter: "text",
      },
      {
        Header: "Outcomes",
        accessor: "outcomes",
        // width: 200,
        // width: getColumnWidth(data, "outcomes", "Outcomes"),
        filter: "text",
      },
      {
        Header: "Products",
        columns: [
          {
            Header: "Industry Code",
            accessor: "products.industry_code",
            width: 114,
            filter: "text",
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
            filter: "text",
          },
          {
            Header: "Name Brand",
            accessor: "products.name_brand",
            // width: getColumnWidth(data, "products.name_brand", "Name Brand"),
            width: 200,
            filter: "text",
          },
          {
            Header: "Role",
            accessor: "products.role",
            width: 100,
            filter: "text",
          },
        ],
      },
      {
        Header: "Reactions",
        accessor: "reactions",
        // width: getColumnWidth(data, "reactions", "Reactions"),
        filter: "text",
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
