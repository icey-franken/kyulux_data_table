import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useTable } from "react-table";

// import makeData from "./makeData";

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
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  });

  // Render the UI for your table
  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>{column.render("Header")}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                // console.log(cell);
                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function TableContainer() {
  const [results, setResults] = useState([]);
  // const [headings, setHeadings] = useState([]);

  useEffect(() => {
    async function getData() {
      const res = await fetch("https://api.fda.gov/food/event.json?limit=100");
      const { results } = await res.json();
      setResults(results);
    }
    getData();
  }, []);
  const data = React.useMemo(() => {
    // const rawData = [
    //   {
    //     consumer: { age: "22", age_unit: "day(s)", gender: "M" },
    //     date_created: "20150501",
    //     date_started: null,
    //     outcomes: [
    //       "Life Threatening",
    //       "Hospitalization",
    //       "Required Intervention",
    //     ],
    //     products: [
    //       // "deal with this",
    //       {
    //         industry_code: "40",
    //         industry_name: "Baby Food Products",
    //         name_brand: "ENFAMIL VARIETY OF INFANT FORMULA POWDER NOT PROVIDED",
    //         role: "SUSPECT",
    //       },
    //       {
    //         industry_code: "123",
    //         industry_name: "asdfasdf",
    //         name_brand: "great value",
    //         role: "SUSPECT",
    //       },
    //     ],
    //     reactions: [
    //       "MENTAL DISORDER",
    //       "CRONOBACTER INFECTION",
    //       "ENTEROBACTER INFECTION",
    //       "CRONOBACTER TEST POSITIVE",
    //       "RESPIRATORY FAILURE",
    //       "MENINGITIS",
    //       "DYSPNOEA",
    //       "LYMPHADENOPATHY",
    //       "BETA HAEMOLYTIC STREPTOCOCCAL INFECTION",
    //       "SEPSIS",
    //       "WHITE BLOOD CELL COUNT INCREASED",
    //     ],
    //     report_number: "185603",
    //   },
		// ];
		const rawData = results
		console.log(results)
    const flattenedData = [];
    rawData.forEach((row) => {
			const subRow = row;
			// console.log(row.products)
			if(Array.isArray(row.products)){
				row.products.forEach((product) => {
					subRow.products = product;
					flattenedData.push({ ...subRow });
				});
			} else{
				flattenedData.push({ ...subRow });
			}
    });
    // console.log("flat data: ", flattenedData);
    return flattenedData;
  }, [results]);

  const columns = React.useMemo(
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
        Cell: ({ cell: { value } }) => {
          // console.log("value", value);
          return <span style={{ color: "red" }}>{value}</span>;
        },
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
