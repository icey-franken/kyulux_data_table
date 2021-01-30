import React, { useEffect, useState } from "react";
import { useTable } from "react-table";
import titleCase from "../utils/titleCase";

export default function ScratchTable() {
  // grab initial data on load
  const [results, setResults] = useState([]);
  const [headings, setHeadings] = useState([]);

  useEffect(() => {
    async function getData() {
      const res = await fetch("https://api.fda.gov/food/event.json?limit=10");
      const { results } = await res.json();
      const headingObjects = Object.keys(results[0]).map((accessor) => ({
        Header: titleCase(accessor),
        accessor,
      }));
      console.log(headingObjects);
      setHeadings(headingObjects);
      console.log("results in fn", results);
      // setResults(results);
      setResults([
        {
          // consumer: { age: "22", age_unit: "day(s)", gender: "M" },
          date_created: "20150501",
          date_started: null,
          outcomes: [
            "Life Threatening", "Hospitalization", "Required Intervention"
          ],
          // products: [
          //   {
          //     industry_code: "40",
          //     industry_name: "Baby Food Products",
          //     name_brand:
          //       "ENFAMIL VARIETY OF INFANT FORMULA POWDER NOT PROVIDED",
          //     role: "SUSPECT",
          //   },
          // ],
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
            "WHITE BLOOD CELL COUNT INCREASED"
          ],
          report_number: "185603",
        },
      ]);
    }
    getData();
  }, []);

  useEffect(() => {
    console.log("results: ", results);
  }, [results]);

  const data = React.useMemo(
    () => results,
    [results]
    // [
    //   {
    //     col1: "Consumer",
    //     col2: "World",
    //   },
    //   {
    //     col1: "react-table",
    //     col2: "rocks",
    //   },
    //   {
    //     col1: "whatever",
    //     col2: "you want",
    //   },
    // ],
    // []
  );

  const columns = React.useMemo(() => headings, [headings]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data });

  return (
    <table {...getTableProps()} style={{ border: "solid 1px blue" }}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th
                {...column.getHeaderProps()}
                style={{
                  borderBottom: "solid 3px red",
                  background: "aliceblue",
                  color: "black",
                  fontWeight: "bold",
                }}
              >
                {column.render("Header")}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return (
                  <td
                    {...cell.getCellProps()}
                    style={{
                      padding: "10px",
                      border: "solid 1px gray",
                      background: "papayawhip",
                    }}
                  >
                    {cell.render("Cell")}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
