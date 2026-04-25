function StudentTable({ students, loading, onEdit, onDelete }) {
  if (loading) {
    return <div className="card status">Loading students...</div>;
  }

  if (students.length === 0) {
    return <div className="card status">No student records found.</div>;
  }

  return (
    <div className="card table-card">
      <h2>Student Records</h2>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Semester</th>
              <th>Year</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.full_name}</td>
                <td>{student.email}</td>
                <td>{student.department}</td>
                <td>{student.semester}</td>
                <td>{student.enrollment_year}</td>
                <td className="actions">
                  <button className="secondary" onClick={() => onEdit(student)}>
                    Edit
                  </button>
                  <button className="danger" onClick={() => onDelete(student.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StudentTable;
