from flask import Blueprint, jsonify, request
from sqlalchemy import func, or_
from sqlalchemy.exc import IntegrityError

from . import db
from .models import Student


student_bp = Blueprint("students", __name__)


@student_bp.get("/students")
def list_students():
    query = Student.query

    search_text = request.args.get("q", "").strip()
    department = request.args.get("department", "").strip()
    semester = request.args.get("semester", "").strip()
    enrollment_year = request.args.get("enrollment_year", "").strip()

    if search_text:
        search_pattern = f"%{search_text}%"
        query = query.filter(
            or_(
                Student.full_name.ilike(search_pattern),
                Student.email.ilike(search_pattern),
                Student.department.ilike(search_pattern),
            )
        )

    if department:
        query = query.filter(Student.department == department)

    if semester:
        try:
            query = query.filter(Student.semester == int(semester))
        except ValueError:
            return jsonify({"error": "semester must be a number."}), 400

    if enrollment_year:
        try:
            query = query.filter(Student.enrollment_year == int(enrollment_year))
        except ValueError:
            return jsonify({"error": "enrollment_year must be a number."}), 400

    students = query.order_by(Student.id.desc()).all()
    return jsonify([student.to_dict() for student in students])


@student_bp.get("/students/stats")
def student_stats():
    total_students = db.session.query(func.count(Student.id)).scalar() or 0

    department_rows = (
        db.session.query(Student.department, func.count(Student.id))
        .group_by(Student.department)
        .order_by(func.count(Student.id).desc())
        .all()
    )
    semester_rows = (
        db.session.query(Student.semester, func.count(Student.id))
        .group_by(Student.semester)
        .order_by(Student.semester.asc())
        .all()
    )

    return jsonify(
        {
            "total_students": total_students,
            "department_breakdown": [
                {"department": department, "count": count}
                for department, count in department_rows
            ],
            "semester_breakdown": [
                {"semester": semester, "count": count}
                for semester, count in semester_rows
            ],
        }
    )


@student_bp.post("/students")
def create_student():
    payload = request.get_json(silent=True) or {}

    required_fields = ["full_name", "email", "department", "semester", "enrollment_year"]
    missing = [field for field in required_fields if not payload.get(field)]
    if missing:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

    student = Student(
        full_name=payload["full_name"].strip(),
        email=payload["email"].strip().lower(),
        department=payload["department"].strip(),
        semester=int(payload["semester"]),
        enrollment_year=int(payload["enrollment_year"]),
    )

    try:
        db.session.add(student)
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "A student with this email already exists."}), 409

    return jsonify(student.to_dict()), 201


@student_bp.put("/students/<int:student_id>")
def update_student(student_id: int):
    student = Student.query.get_or_404(student_id)
    payload = request.get_json(silent=True) or {}

    for field in ["full_name", "email", "department", "semester", "enrollment_year"]:
        if field in payload and payload[field] is not None:
            value = payload[field]
            if isinstance(value, str):
                value = value.strip()
            if field == "email":
                value = value.lower()
            setattr(student, field, value)

    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "Unable to update student. Email may already exist."}), 409

    return jsonify(student.to_dict())


@student_bp.delete("/students/<int:student_id>")
def delete_student(student_id: int):
    student = Student.query.get_or_404(student_id)
    db.session.delete(student)
    db.session.commit()
    return jsonify({"message": "Student deleted successfully."})
