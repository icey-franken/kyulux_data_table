// filtering start https://blog.logrocket.com/building-styling-tables-react-table-v7/#filtering
// freeze header pane https://codesandbox.io/s/k9n3y82wov

import React, { useEffect, useState, useMemo } from "react";
import Table from "./Table";

// here we set up table structure, data, and styling
export default function TableContainer() {
  const [tableData, setTableData] = useState([]);
  // load initial data.

  useEffect(() => {
    async function getData() {
      let skip = 0;
      // skip<3000 because too slow otherwise... this is a problem
      while (skip < 3000) {
        console.log("skip and table data length: ", skip, tableData.length);
        const res = await fetch(
          `https://api.fda.gov/food/event.json?limit=1000&skip=${skip}`
        );
        const { results } = await res.json();
        if (results) {
          setTableData((tableData) => [...tableData, ...results]);
        } else {
          break;
        }
        skip += 1000;
      }
    }
    if (tableData.length === 0) {
      getData();
    }
    // eslint-disable-next-line
  }, []);

  const getColumnWidth = (rows, accessor, headerText) => {
    // pass in page, NOT rows - rows too much data and no benefit
    const maxWidth = 400;
    const magicSpacing = 10;
    const rowLenArr = rows.map((row) => {
      return (`${row[accessor]}` || "").length;
    });
    const potentialLenArr = [...rowLenArr, headerText.length];
    const cellLength = Math.max(...potentialLenArr);
    const result = Math.min(maxWidth, cellLength * magicSpacing);
    return result;
  };

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

  return <Table columns={columns} data={data} />;
}
