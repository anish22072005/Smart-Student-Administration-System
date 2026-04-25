import os

from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

from .config import Config


db = SQLAlchemy()


def create_app() -> Flask:
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app, resources={r"/api/*": {"origins": "*"}})

    db.init_app(app)

    from .routes import student_bp

    app.register_blueprint(student_bp, url_prefix="/api")

    @app.get("/api/health")
    def health_check():
        return {"status": "ok"}

    auto_create_tables = os.getenv("AUTO_CREATE_TABLES", "1").lower() in {"1", "true", "yes"}
    if auto_create_tables:
        with app.app_context():
            try:
                db.create_all()
            except Exception as exc:
                # Don't crash the web process if DB is temporarily unreachable during boot.
                app.logger.warning("Skipping db.create_all at startup: %s", exc)

    return app
