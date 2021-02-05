export const DefaultColumnFilter = ({ column }) => {
  const { filterValue, preFilteredRows, setFilter } = column;
  const count = preFilteredRows.length;
  return (
    <input
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
      placeholder={`Search ${count} records...`}
      style={{ textAlign: "left", width: `${column.width}px` }}
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
    <div className="header__global-search">
      Search:{" "}
      <input
        value={globalFilter || ""}
        onChange={(e) => {
          setGlobalFilter(e.target.value || undefined);
        }}
        placeholder={`Search ${count} records...`}
      />
    </div>
  );
};
