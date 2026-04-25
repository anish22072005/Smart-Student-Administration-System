import { useEffect, useState } from "react";

const initialState = {
  full_name: "",
  email: "",
  department: "",
  semester: "",
  enrollment_year: "",
};

function StudentForm({ onSubmit, loading, selectedStudent, onCancelEdit }) {
  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if (selectedStudent) {
      setFormData({
        full_name: selectedStudent.full_name || "",
        email: selectedStudent.email || "",
        department: selectedStudent.department || "",
        semester: String(selectedStudent.semester || ""),
        enrollment_year: String(selectedStudent.enrollment_year || ""),
      });
      return;
    }
    setFormData(initialState);
  }, [selectedStudent]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit({
      ...formData,
      semester: Number(formData.semester),
      enrollment_year: Number(formData.enrollment_year),
    });

    if (!selectedStudent) {
      setFormData(initialState);
    }
  };

  return (
    <form className="card form-card" onSubmit={handleSubmit}>
      <div className="form-header">
        <h2>{selectedStudent ? "Edit Student" : "Add New Student"}</h2>
        {selectedStudent && (
          <button type="button" className="secondary" onClick={onCancelEdit}>
            Cancel Edit
          </button>
        )}
      </div>

      <div className="grid two-columns">
        <label>
          Full Name
          <input
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            placeholder="John Doe"
            required
          />
        </label>

        <label>
          Email
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            required
          />
        </label>

        <label>
          Department
          <input
            name="department"
            value={formData.department}
            onChange={handleChange}
            placeholder="Computer Science"
            required
          />
        </label>

        <label>
          Semester
          <input
            type="number"
            min="1"
            max="12"
            name="semester"
            value={formData.semester}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Enrollment Year
          <input
            type="number"
            min="2000"
            max="2100"
            name="enrollment_year"
            value={formData.enrollment_year}
            onChange={handleChange}
            required
          />
        </label>
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Saving..." : selectedStudent ? "Update Student" : "Add Student"}
      </button>
    </form>
  );
}

export default StudentForm;
