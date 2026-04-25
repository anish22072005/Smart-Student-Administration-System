import os
from urllib.parse import quote_plus

from dotenv import load_dotenv


ENV_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".env"))
load_dotenv(ENV_PATH)


def _first_env(*keys: str, default: str = "") -> str:
    for key in keys:
        value = os.getenv(key)
        if value is not None and value != "":
            return value
    return default


class Config:
    BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    SQLITE_DB_PATH = os.getenv(
        "SQLITE_DB_PATH",
        os.path.join(BASE_DIR, "instance", "smart_student_admin.db"),
    )
    IS_RENDER = os.getenv("RENDER", "").lower() == "true"

    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret")
    DATABASE_URL = os.getenv("DATABASE_URL", "").strip()
    DB_ENGINE = os.getenv("DB_ENGINE", "mysql" if DATABASE_URL else "sqlite").lower()
    MYSQL_HOST = _first_env("MYSQL_HOST", "DB_HOST", default="localhost")
    MYSQL_PORT = _first_env("MYSQL_PORT", "DB_PORT", default="3306")
    MYSQL_USER = _first_env("MYSQL_USER", "DB_USER", default="root")
    MYSQL_PASSWORD = _first_env("MYSQL_PASSWORD", "DB_PASSWORD", default="")
    MYSQL_DB = _first_env("MYSQL_DB", "DB_NAME", default="smart_student_admin")
    MYSQL_SSL = os.getenv("MYSQL_SSL", "1" if IS_RENDER else "0").lower() in {
        "1",
        "true",
        "yes",
    }

    SQLALCHEMY_ENGINE_OPTIONS = {
        "pool_pre_ping": True,
        "pool_recycle": 280,
    }

    if DATABASE_URL:
        if DATABASE_URL.startswith("mysql://"):
            DATABASE_URL = DATABASE_URL.replace("mysql://", "mysql+pymysql://", 1)
        SQLALCHEMY_DATABASE_URI = DATABASE_URL
    elif DB_ENGINE == "mysql":
        if IS_RENDER and MYSQL_HOST in {"", "localhost", "127.0.0.1"}:
            raise RuntimeError(
                "MYSQL_HOST is not configured for Render. "
                "Set MYSQL_HOST or DATABASE_URL in Render environment variables."
            )

        mysql_user = quote_plus(MYSQL_USER)
        mysql_password = quote_plus(MYSQL_PASSWORD)
        SQLALCHEMY_DATABASE_URI = (
            f"mysql+pymysql://{mysql_user}:{mysql_password}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB}"
        )
    else:
        SQLALCHEMY_DATABASE_URI = f"sqlite:///{SQLITE_DB_PATH}"

    if DB_ENGINE == "mysql" and MYSQL_SSL:
        SQLALCHEMY_ENGINE_OPTIONS["connect_args"] = {
            "ssl": {},
            "connect_timeout": 15,
            "read_timeout": 30,
            "write_timeout": 30,
        }

    SQLALCHEMY_TRACK_MODIFICATIONS = False
