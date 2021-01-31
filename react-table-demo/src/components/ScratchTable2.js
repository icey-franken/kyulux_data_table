import React from "react";
// import styled from "styled-components";
import { useTable } from "react-table";

// import makeData from "./makeData";

// const Styles = styled.div`
//   padding: 1rem;

//   table {
//     border-spacing: 0;
//     border: 1px solid black;

//     tr {
//       :last-child {
//         td {
//           border-bottom: 0;
//         }
//       }
//     }

//     th,
//     td {
//       margin: 0;
//       padding: 0.5rem;
//       border-bottom: 1px solid black;
//       border-right: 1px solid black;

//       :last-child {
//         border-right: 0;
//       }
//     }
//   }
// `;

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
                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function App() {
const data = React.useMemo(
  () => [
    {
      consumer: { age: "22", age_unit: "day(s)", gender: "M" },
      date_created: "20150501",
      date_started: null,
      outcomes: [
        "Life Threatening",
        "Hospitalization",
        "Required Intervention",
      ],
      products: [
        // "deal with this",
        {
          industry_code: "40",
          industry_name: "Baby Food Products",
          name_brand: "ENFAMIL VARIETY OF INFANT FORMULA POWDER NOT PROVIDED",
          role: "SUSPECT",
        },
      ],
      reactions: [
        "MENTAL DISORDER",
        "CRONOBACTER INFECTION",
        "ENTEROBACTER INFECTION",
        "CRONOBACTER TEST POSITIVE",
        "RESPIRATORY FAILURE",
        "MENINGITIS",
        "DYSPNOEA",
        "LYMPHADENOPATHY",
        "BETA HAEMOLYTIC STREPTOCOCCAL INFECTION",
        "SEPSIS",
        "WHITE BLOOD CELL COUNT INCREASED",
      ],
      report_number: "185603",
    },
  ],
  []
);

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
      },
      { Header: "Reactions", accessor: "reactions" },
      { Header: "Report Number", accessor: "report_number" },
      // {
      //   Header: "Info",
      //   columns: [
      //     {
      //       Header: "Age",
      //       accessor: "age",
      //     },
      //     {
      //       Header: "Visits",
      //       accessor: "visits",
      //     },
      //     {
      //       Header: "Status",
      //       accessor: "status",
      //     },
      //     {
      //       Header: "Profile Progress",
      //       accessor: "progress",
      //     },
      //   ],
      // },
    ],
    []
  );

  // const data = React.useMemo(() => makeData(20), []);

  return (
    // <Styles>
      <Table columns={columns} data={data} />
    // </Styles>
  );
}

export default App;
