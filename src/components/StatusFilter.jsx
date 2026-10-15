function StatusFilter({ statusFilter, setStatusFilter }) {
  return (
    <div className="table-toolbar">
      <div className="filter-row">
        <label htmlFor="statusFilter">Filter by Status:</label>

        <select
          id="statusFilter"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option value="All">All</option>
          <option value="Active">Active</option>
          <option value="Expired">Expired</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>
    </div>
  );
}

export default StatusFilter;