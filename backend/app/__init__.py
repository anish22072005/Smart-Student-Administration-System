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

    with app.app_context():
        db.create_all()

    return app
