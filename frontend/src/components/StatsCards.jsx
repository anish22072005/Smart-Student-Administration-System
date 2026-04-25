function StatsCards({ stats, loading }) {
  if (loading) {
    return <div className="card status">Loading dashboard stats...</div>;
  }

  if (!stats) {
    return null;
  }

  const topDepartments = stats.department_breakdown.slice(0, 3);
  const semesterSummary = stats.semester_breakdown.slice(0, 4);

  return (
    <div className="stats-grid">
      <div className="card stat-card">
        <p className="stat-label">Total Students</p>
        <p className="stat-value">{stats.total_students}</p>
      </div>

      <div className="card stat-card">
        <p className="stat-label">Top Departments</p>
        {topDepartments.length === 0 ? (
          <p className="stat-subtle">No data yet</p>
        ) : (
          topDepartments.map((entry) => (
            <p key={entry.department} className="stat-row">
              <span>{entry.department}</span>
              <strong>{entry.count}</strong>
            </p>
          ))
        )}
      </div>

      <div className="card stat-card">
        <p className="stat-label">Semester Mix</p>
        {semesterSummary.length === 0 ? (
          <p className="stat-subtle">No data yet</p>
        ) : (
          semesterSummary.map((entry) => (
            <p key={entry.semester} className="stat-row">
              <span>Semester {entry.semester}</span>
              <strong>{entry.count}</strong>
            </p>
          ))
        )}
      </div>
    </div>
  );
}

export default StatsCards;
