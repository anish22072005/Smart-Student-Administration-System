import { useState } from "react";

function FilterBar({ onApply, onReset, loading }) {
  const [filters, setFilters] = useState({
    q: "",
    department: "",
    semester: "",
    enrollment_year: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const normalized = Object.fromEntries(
      Object.entries(filters).filter(([, value]) => String(value).trim() !== "")
    );
    onApply(normalized);
  };

  const handleReset = () => {
    const resetValue = {
      q: "",
      department: "",
      semester: "",
      enrollment_year: "",
    };
    setFilters(resetValue);
    onReset();
  };

  return (
    <form className="card filter-card" onSubmit={handleSubmit}>
      <h2>Search & Filters</h2>
      <div className="grid two-columns">
        <label>
          Search
          <input
            name="q"
            value={filters.q}
            onChange={handleChange}
            placeholder="Name, email, or department"
          />
        </label>

        <label>
          Department
          <input
            name="department"
            value={filters.department}
            onChange={handleChange}
            placeholder="Computer Science"
          />
        </label>

        <label>
          Semester
          <input
            type="number"
            name="semester"
            value={filters.semester}
            onChange={handleChange}
            min="1"
            max="12"
            placeholder="e.g. 4"
          />
        </label>

        <label>
          Enrollment Year
          <input
            type="number"
            name="enrollment_year"
            value={filters.enrollment_year}
            onChange={handleChange}
            min="2000"
            max="2100"
            placeholder="e.g. 2026"
          />
        </label>
      </div>

      <div className="filter-actions">
        <button type="submit" disabled={loading}>
          Apply Filters
        </button>
        <button type="button" className="secondary" onClick={handleReset} disabled={loading}>
          Reset
        </button>
      </div>
    </form>
  );
}

export default FilterBar;
