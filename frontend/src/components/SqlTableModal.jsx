function SqlTableModal({ open, onClose, rows, loading, error }) {
  const queryText = `SELECT id, full_name, email, department, semester, enrollment_year, created_at, updated_at
FROM students
ORDER BY id DESC;`;

  const handleCopyQuery = async () => {
    try {
      await navigator.clipboard.writeText(queryText);
    } catch {
      // Ignore clipboard failures in browsers that block it.
    }
  };

  if (!open) {
    return null;
  }

  return (
    <div className="sql-modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="card sql-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sql-table-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sql-modal-header">
          <div>
            <p className="eyebrow">MySQL Table View</p>
            <h2 id="sql-table-title">students table</h2>
          </div>
          <button type="button" className="secondary" onClick={onClose}>
            Close
          </button>
        </div>

        <p className="sql-modal-note">
          This preview is loaded from MySQL.
        </p>

        <div className="sql-query-box">
          <div className="sql-query-header">
            <strong>SQL query</strong>
            <button type="button" className="ghost-button" onClick={handleCopyQuery}>
              Copy SQL
            </button>
          </div>
          <pre>{queryText}</pre>
        </div>

        {loading && <div className="status">Loading SQL table...</div>}

        {error && <div className="error-banner">{error}</div>}

        {!loading && !error && (
          <div className="table-wrapper sql-preview-table">
            {rows.length === 0 ? (
              <div className="status">No rows found in the students table.</div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Department</th>
                    <th>Semester</th>
                    <th>Year</th>
                    <th>Created At</th>
                    <th>Updated At</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id}>
                      <td>{row.id}</td>
                      <td>{row.full_name}</td>
                      <td>{row.email}</td>
                      <td>{row.department}</td>
                      <td>{row.semester}</td>
                      <td>{row.enrollment_year}</td>
                      <td>{row.created_at ? new Date(row.created_at).toLocaleString() : "-"}</td>
                      <td>{row.updated_at ? new Date(row.updated_at).toLocaleString() : "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SqlTableModal;
