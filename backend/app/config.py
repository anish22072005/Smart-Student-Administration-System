import os
from urllib.parse import quote_plus

from dotenv import load_dotenv


ENV_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".env"))
load_dotenv(ENV_PATH)


class Config:
    BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    SQLITE_DB_PATH = os.path.join(BASE_DIR, "instance", "smart_student_admin.db")

    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret")
    DB_ENGINE = os.getenv("DB_ENGINE", "sqlite").lower()
    MYSQL_HOST = os.getenv("MYSQL_HOST", "localhost")
    MYSQL_PORT = os.getenv("MYSQL_PORT", "3306")
    MYSQL_USER = os.getenv("MYSQL_USER", "root")
    MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "")
    MYSQL_DB = os.getenv("MYSQL_DB", "smart_student_admin")

    if DB_ENGINE == "mysql":
        mysql_user = quote_plus(MYSQL_USER)
        mysql_password = quote_plus(MYSQL_PASSWORD)
        SQLALCHEMY_DATABASE_URI = (
            f"mysql+pymysql://{mysql_user}:{mysql_password}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB}"
        )
    else:
        SQLALCHEMY_DATABASE_URI = f"sqlite:///{SQLITE_DB_PATH}"

    SQLALCHEMY_TRACK_MODIFICATIONS = False
