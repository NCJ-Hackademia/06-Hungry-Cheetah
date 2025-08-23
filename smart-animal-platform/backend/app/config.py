from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    # MongoDB Configuration
    mongodb_url: str = "mongodb://localhost:27017"
    mongodb_db: str = "smart_animal_platform"
    
    # JWT Configuration
    secret_key: str = "your-secret-key-here-make-it-long-and-secure"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # Application Configuration
    app_name: str = "Smart Animal Platform API"
    debug: bool = True
    cors_origins: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]
    
    # Optional: External APIs
    weather_api_key: str = ""
    payment_api_key: str = ""
    
    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()
