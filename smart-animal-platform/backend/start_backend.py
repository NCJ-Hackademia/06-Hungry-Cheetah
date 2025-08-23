#!/usr/bin/env python3
"""
Startup script for Smart Animal Platform FastAPI Backend
"""

import os
import sys
import subprocess
import time
from pathlib import Path

def check_python_version():
    """Check if Python version is compatible."""
    if sys.version_info < (3, 8):
        print("❌ Error: Python 3.8 or higher is required")
        print(f"Current version: {sys.version}")
        sys.exit(1)
    print(f"✅ Python version: {sys.version.split()[0]}")

def check_mongodb():
    """Check if MongoDB is running."""
    try:
        import pymongo
        client = pymongo.MongoClient("mongodb://localhost:27017", serverSelectionTimeoutMS=5000)
        client.admin.command('ping')
        print("✅ MongoDB is running")
        client.close()
        return True
    except Exception as e:
        print("❌ MongoDB is not running or not accessible")
        print("Please start MongoDB or update MONGODB_URL in .env")
        return False

def install_dependencies():
    """Install Python dependencies."""
    print("📦 Installing dependencies...")
    try:
        subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"], check=True)
        print("✅ Dependencies installed successfully")
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install dependencies: {e}")
        sys.exit(1)

def create_env_file():
    """Create .env file if it doesn't exist."""
    env_file = Path(".env")
    env_example = Path("env.example")
    
    if not env_file.exists() and env_example.exists():
        print("📝 Creating .env file from template...")
        try:
            with open(env_example, 'r') as f:
                content = f.read()
            
            # Generate a secure secret key
            import secrets
            secret_key = secrets.token_urlsafe(32)
            content = content.replace("your-secret-key-here-make-it-long-and-secure", secret_key)
            
            with open(env_file, 'w') as f:
                f.write(content)
            
            print("✅ .env file created with secure secret key")
        except Exception as e:
            print(f"❌ Failed to create .env file: {e}")
    elif env_file.exists():
        print("✅ .env file already exists")

def start_server():
    """Start the FastAPI server."""
    print("🚀 Starting Smart Animal Platform API...")
    print("📚 API Documentation will be available at:")
    print("   - Swagger UI: http://localhost:8000/docs")
    print("   - ReDoc: http://localhost:8000/redoc")
    print("   - Health Check: http://localhost:8000/health")
    print("\n" + "="*50)
    
    try:
        subprocess.run([
            sys.executable, "-m", "uvicorn", 
            "app.main:app", 
            "--reload", 
            "--host", "0.0.0.0", 
            "--port", "8000"
        ], check=True)
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to start server: {e}")
        sys.exit(1)

def main():
    """Main startup function."""
    print("🐄 Smart Animal Platform - FastAPI Backend")
    print("="*50)
    
    # Check Python version
    check_python_version()
    
    # Create .env file if needed
    create_env_file()
    
    # Check MongoDB
    if not check_mongodb():
        print("\n💡 To start MongoDB:")
        print("   - Windows: Start MongoDB service")
        print("   - macOS: brew services start mongodb-community")
        print("   - Linux: sudo systemctl start mongod")
        print("   - Or use MongoDB Atlas (cloud)")
        
        response = input("\nContinue anyway? (y/N): ")
        if response.lower() != 'y':
            sys.exit(1)
    
    # Install dependencies
    install_dependencies()
    
    # Start server
    start_server()

if __name__ == "__main__":
    main()
