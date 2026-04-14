import sys
import os

# Add backend directory to path so 'app' module is found
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), 'backend'))

from app.main import app
