"""Initialize database for production on Render."""
import os
from dotenv import load_dotenv
from app import create_app, db

# Load Render env vars if available, otherwise use .env
load_dotenv()

app = create_app()

with app.app_context():
    print("Creating database tables...")
    db.create_all()
    print("✓ Database tables created successfully!")
