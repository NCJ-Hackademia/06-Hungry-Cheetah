# Smart Animal Platform - FastAPI Backend

A comprehensive FastAPI backend for the Smart Animal Management & Marketplace Platform with MongoDB integration.

## 🚀 Features

- **FastAPI Framework** - Modern, fast web framework for building APIs
- **MongoDB Integration** - NoSQL database with Motor for async operations
- **JWT Authentication** - Secure token-based authentication
- **Role-based Access Control** - Farmer, Buyer, Veterinarian roles
- **IoT Data Management** - Real-time sensor data handling
- **Marketplace System** - Animal listings and transactions
- **Comprehensive API Documentation** - Auto-generated with Swagger/ReDoc

## 📋 Prerequisites

- Python 3.8+
- MongoDB 4.4+
- pip (Python package manager)

## 🛠 Installation

1. **Clone the repository**
   ```bash
   cd smart-animal-platform/backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

5. **Start MongoDB**
   ```bash
   # Make sure MongoDB is running on localhost:27017
   # Or update MONGODB_URL in .env
   ```

## 🚀 Running the Application

### Development Mode
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Production Mode
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## 📚 API Documentation

Once the server is running, you can access:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

## 🗄 Database Schema

### Collections

1. **users** - User accounts and profiles
2. **animals** - Animal records and health data
3. **listings** - Marketplace listings
4. **iot_metrics** - IoT sensor data
5. **orders** - Transaction records
6. **messages** - Communication between users

### Indexes

The application automatically creates optimized indexes for:
- Email uniqueness
- Geographic queries (2dsphere)
- Time-based queries
- User ownership filtering

## 🔐 Authentication

### JWT Token Flow

1. **Register**: `POST /api/v1/auth/register`
2. **Login**: `POST /api/v1/auth/login`
3. **Use Token**: Include `Authorization: Bearer <token>` in headers

### User Roles

- **farmer** - Can manage animals, create listings
- **buyer** - Can browse listings, make purchases
- **vet** - Can view health data, provide consultations
- **admin** - Full system access

## 📡 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/me` - Get current user info

### Animals
- `GET /api/v1/animals` - List animals (with filtering)
- `POST /api/v1/animals` - Create new animal
- `GET /api/v1/animals/{id}` - Get specific animal
- `PUT /api/v1/animals/{id}` - Update animal
- `DELETE /api/v1/animals/{id}` - Delete animal
- `GET /api/v1/animals/my/animals` - Get user's animals

### Marketplace
- `GET /api/v1/marketplace/listings` - Browse listings
- `POST /api/v1/marketplace/listings` - Create listing
- `GET /api/v1/marketplace/listings/{id}` - Get specific listing
- `PUT /api/v1/marketplace/listings/{id}` - Update listing
- `DELETE /api/v1/marketplace/listings/{id}` - Delete listing
- `GET /api/v1/marketplace/my/listings` - Get user's listings

### IoT Metrics
- `GET /api/v1/iot/metrics` - Get IoT data
- `POST /api/v1/iot/metrics` - Create IoT metrics
- `GET /api/v1/iot/metrics/{animal_id}/latest` - Latest metrics
- `PUT /api/v1/iot/metrics/{animal_id}/simulate` - Simulate data
- `GET /api/v1/iot/metrics/{animal_id}/history` - Historical data

## 🔧 Configuration

### Environment Variables

```env
# MongoDB Configuration
MONGODB_URL=mongodb://localhost:27017
MONGODB_DB=smart_animal_platform

# JWT Configuration
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Application Configuration
APP_NAME=Smart Animal Platform API
DEBUG=True
CORS_ORIGINS=["http://localhost:3000"]

# Optional: External APIs
WEATHER_API_KEY=your-weather-api-key
PAYMENT_API_KEY=your-payment-api-key
```

## 🧪 Testing

### Run Tests
```bash
pytest
```

### Test Coverage
```bash
pytest --cov=app
```

## 📊 Performance

### Optimizations

- **Async Database Operations** - Non-blocking MongoDB queries
- **Database Indexes** - Optimized for common queries
- **Connection Pooling** - Efficient database connections
- **CORS Configuration** - Secure cross-origin requests

### Monitoring

- **Health Check Endpoint** - `/health`
- **Logging** - Comprehensive application logs
- **Error Handling** - Global exception handlers

## 🔒 Security

- **Password Hashing** - bcrypt for secure password storage
- **JWT Tokens** - Stateless authentication
- **Input Validation** - Pydantic models for data validation
- **CORS Protection** - Configurable cross-origin policies
- **Role-based Access** - Granular permission control

## 🚀 Deployment

### Docker (Recommended)

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Environment Setup

1. **Production Environment Variables**
2. **MongoDB Atlas** (cloud database)
3. **Reverse Proxy** (nginx)
4. **SSL Certificate** (Let's Encrypt)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation at `/docs`
- Review the logs for debugging information
