// !!! can live elsewhere
export const DefaultColumnFilter = ({ column }) => {
  // console.log(column);
  const { filterValue, preFilteredRows, setFilter } = column;
  const count = preFilteredRows.length;

  return (
    <input
      size={column.width}
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
      placeholder={`Search ${count} records...`}
      style={{ textAlign: "left" }}
    />
  );
};

export const GlobalFilter = ({
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
