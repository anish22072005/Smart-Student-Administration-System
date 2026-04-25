import { useEffect, useState } from "react";

import {
  createStudent,
  deleteStudent,
  getStudents,
  getStudentStats,
  updateStudent,
} from "./api";
import FilterBar from "./components/FilterBar";
import StatsCards from "./components/StatsCards";
import StudentForm from "./components/StudentForm";
import StudentTable from "./components/StudentTable";
import SqlTableModal from "./components/SqlTableModal";

function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({});
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [sqlModalOpen, setSqlModalOpen] = useState(false);
  const [sqlRows, setSqlRows] = useState([]);
  const [sqlLoading, setSqlLoading] = useState(false);
  const [sqlError, setSqlError] = useState("");

  const loadStudents = async (activeFilters = filters) => {
    try {
      setLoading(true);
      const data = await getStudents(activeFilters);
      setStudents(data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load students.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents(filters);
  }, [filters]);

  const loadStats = async () => {
    try {
      setStatsLoading(true);
      const data = await getStudentStats();
      setStats(data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load dashboard stats.");
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    if (!sqlModalOpen) {
      return;
    }

    const loadSqlPreview = async () => {
      try {
        setSqlLoading(true);
        setSqlError("");
        const data = await getStudents();
        setSqlRows(data);
      } catch (err) {
        setSqlError(err.response?.data?.error || "Failed to load SQL table preview.");
      } finally {
        setSqlLoading(false);
      }
    };

    loadSqlPreview();
  }, [sqlModalOpen]);

  const handleSubmit = async (formData) => {
    try {
      setSaving(true);
      setError("");

      if (selectedStudent) {
        await updateStudent(selectedStudent.id, formData);
      } else {
        await createStudent(formData);
      }

      setSelectedStudent(null);
      await Promise.all([loadStudents(filters), loadStats()]);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save student.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (studentId) => {
    const confirmed = window.confirm("Delete this student record?");
    if (!confirmed) {
      return;
    }

    try {
      await deleteStudent(studentId);
      if (selectedStudent?.id === studentId) {
        setSelectedStudent(null);
      }
      await Promise.all([loadStudents(filters), loadStats()]);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete student.");
    }
  };

  const handleApplyFilters = (nextFilters) => {
    setFilters(nextFilters);
  };

  const handleResetFilters = () => {
    setFilters({});
  };

  const openSqlTable = () => {
    setSqlModalOpen(true);
  };

  const closeSqlTable = () => {
    setSqlModalOpen(false);
  };

  return (
    <div className="app-shell">
      <header className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Student Database Console</p>
          <h1>Smart Student Administration System</h1>
        </div>
      </header>

      {error && <div className="error-banner">{error}</div>}

      <StatsCards stats={stats} loading={statsLoading} />

      <FilterBar onApply={handleApplyFilters} onReset={handleResetFilters} loading={loading} />

      <div className="sql-toolbar">
        <button type="button" className="secondary" onClick={openSqlTable}>
          View SQL Table
        </button>
      </div>

      <main className="layout">
        <StudentForm
          onSubmit={handleSubmit}
          loading={saving}
          selectedStudent={selectedStudent}
          onCancelEdit={() => setSelectedStudent(null)}
        />

        <StudentTable
          students={students}
          loading={loading}
          onEdit={setSelectedStudent}
          onDelete={handleDelete}
        />
      </main>

      <SqlTableModal
        open={sqlModalOpen}
        onClose={closeSqlTable}
        rows={sqlRows}
        loading={sqlLoading}
        error={sqlError}
      />
    </div>
  );
}

export default App;
