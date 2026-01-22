const Filter = ({ filterValue, setFilterValue }) => {
  return (
    <>
      filter shown with{" "}
      <input
        value={filterValue}
        onChange={(e) => setFilterValue(e.target.value)}
      />
    </>
  );
};

export default Filter;
