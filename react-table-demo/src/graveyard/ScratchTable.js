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
      const headingObjects = Object.keys(results[0]).map((accessor) => {
        return {
          Header: titleCase(accessor),
          accessor,
          Cell: (row) => {
            const values = row.value;
						const type = typeof values;
						console.log('values and type', values, type)
            if (type === "string") {
							console.log('hits string. Value:', values)
              return <div>{row.values}</div>;
            } else if (Array.isArray(values)) {
              return (
                <div>
                  {values.map((value, idx) => {
                    if (typeof value === "object") {
                      return Object.values(value).map((val, idx) => (
                        <div key={idx}>{val}</div>
                      ));
                    } else {
                      return <div key={idx}>{value}</div>;
                    }
                  })}
                </div>
              );
            } else if (values && type === "object") {
              console.log(values);
              // debugger;
              console.log("value keys if object: ", Object.keys(values));
              console.log("is object");
              console.log(
                "object keys of value if object: ",
                Object.keys(values)
              );
              // return Object.keys(value).map((accessor) => {
              //   return {
              //     Header: titleCase(accessor),
              //     accessor,
              //   };
              // });
              return (
                <div>
                  {Object.values(values).map((value, idx) => (
                    <div key={idx}>{value}</div>
                  ))}
                </div>
              );
              // return <div>object buddy</div>;
            } else{
              return <div>{row.values}</div>;
						}
            // console.log("row.value", row.value);
            // console.log("accessor", accessor);
            // // const rowVal = Array.isArray(row.row.original[accessor])
            // console.log("row.row", row.row);
            // console.log("typeof", typeof row.row.original[accessor]);
            // console.log("isArray", Array.isArray(row.value));

            // console.log("row@accessor", row.row.original[accessor]);
            // console.log(row.row.original[accessor])
            // return row
            // return (
            //   <div>
            //     <span className="class-for-name">
            //       {/* {row.row.product.name} */}
            //     </span>
            //     <span className="class-for-description">
            //       {/* {row.row.product.description} */}
            //     </span>
            //   </div>
            // );
          },
        };
      });
      setHeadings(headingObjects);
      // console.log("results in fn", results);
      // setResults(results);
      setResults([
        {
          // consumer: { age: "22", age_unit: "day(s)", gender: "M" },
          date_created: "20150501",
          date_started: null,
          outcomes: [
            "Life Threatening",
            "Hospitalization",
            "Required Intervention",
          ],
          // products: [
          //   // "deal with this",
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
            "WHITE BLOOD CELL COUNT INCREASED",
          ],
          report_number: "185603",
        },
      ]);
    }
    getData();
  }, []);

  // useEffect(() => {
  //   console.log("results: ", results);
  // }, [results]);

  const data = React.useMemo(() => results, [results]);

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
