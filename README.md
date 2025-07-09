
# SportsPro Technical Support

A full-stack application for managing customer support incidents, technician assignments, and customer registrations.

---

## 📚 Table of Contents

- [System Requirements](#system-requirements)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Docker Setup](#docker-setup)
- [Development Workflow](#development-workflow)
- [Production Deployment](#production-deployment)
- [Troubleshooting](#troubleshooting)
- [API Documentation](#api-documentation)
- [License](#license)

---

## ✅ System Requirements

- **Docker** `20.10.0+`  
- **Docker Compose** `1.29.0+`  
- **Node.js** `18.x` (for local development)  
- **PostgreSQL** `15.x` (included via Docker)

---

## 🗂 Project Structure

```
sportspro/
├── client/                  # Frontend application
│   ├── Dockerfile           # Frontend Docker config
│   └── ...                  # Source files
├── server/                  # Backend API
│   ├── Dockerfile           # Backend Docker config
│   ├── routes/              # Route handlers (product, technician, incident, etc.)
│   ├── controllers/         # Controller logic
│   ├── utils/               # DB configuration
│   └── index.js             # Express server
├── nginx/
│   ├── nginx.conf           # Nginx reverse proxy config
│   └── certs/               # SSL certificates
├── docker-compose.yml       # Docker orchestration
├── .env.example             # Environment variable template
└── README.md                # This documentation
```

---

## ⚙️ Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-repo/sportspro.git
cd sportspro

# 2. Configure environment
cp .env.example .env
# → Edit the .env file with your credentials

# 3. Build and start all containers
docker-compose up -d --build
```

---

## 🔧 Configuration

### Essential Environment Variables (`.env`)

```env
# PostgreSQL
DB_USER=postgres
DB_PASSWORD=yoursecurepassword
DB_NAME=sportspro_db
DB_HOST=postgres
DB_PORT=5432

# App
NODE_ENV=production
PORT=8000
```

### SSL Certificates (Development)

```bash
mkdir -p nginx/certs
openssl req -x509 -nodes -days 365 -newkey rsa:2048   -keyout nginx/certs/sportspro.key   -out nginx/certs/sportspro.crt   -subj "/CN=sportspro.local"
```

---

## 🐳 Docker Setup

### Services

- `sportspro-api` - Node.js backend (port `8000`)
- `sportspro-frontend` - React frontend (port `80`)
- `nginx-proxy` - Reverse proxy (ports `80`, `443`)
- `postgres` - PostgreSQL database (port `5432`)

### Common Docker Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild a specific service
docker-compose up -d --build sportspro-api
```

---

## 🚀 Development Workflow

```bash
# Start only the database
docker-compose up -d postgres

# Run backend
cd server
npm install
npm run dev

# Run frontend
cd client
npm install
npm start
```

---

## 🌐 Production Deployment

### Requirements

- Domain name
- SSL certificates (Let's Encrypt or other CA)
- Database backup strategy
- CI/CD pipeline (e.g., GitHub Actions)

### Steps

1. Replace self-signed certs with real ones in `nginx/certs/`
2. Update `nginx.conf` for production
3. Set `NODE_ENV=production` in `.env`
4. Configure GitHub Actions or other CI/CD pipeline
5. Set up logging and monitoring

---

## 🛠 Troubleshooting

| Issue                        | Resolution                                               |
|-----------------------------|----------------------------------------------------------|
| API containers failing      | Check `/health` endpoint, DB connection, healthcheck    |
| SSL errors                  | Ensure valid certs in `nginx/certs`, fix permissions     |
| Port conflicts              | Run `netstat -ano | findstr :80` to kill blocking process|

---

## 📡 API Documentation

### 🧾 Incidents

- `GET /api/incident` - Get all incidents  
- `POST /api/incident` - Create new incident  
- `GET /api/incident/:id` - Get incident by ID  
- `PUT /api/incident/:id` - Update incident  
- `PUT /api/incident/:id/assign` - Assign technician to incident  

#### Sample Requests

```bash
# Get all incidents
curl -X GET http://localhost:8000/api/incident

# Create new incident
curl -X POST http://localhost:8000/api/incident   -H "Content-Type: application/json"   -d '{"title":"Login issue","description":"User cannot login"}'

# Assign technician
curl -X PUT http://localhost:8000/api/incident/123/assign   -H "Content-Type: application/json"   -d '{"technicianId": 456}'
```

### 👨‍🔧 Technicians

- `GET /api/technicians` - List all technicians  
- `POST /api/technicians` - Add a technician  

### 🧑‍💻 Customers

- `GET /api/customers`  
- `POST /api/customers`  

### 📦 Products

- `GET /api/products`  
- `POST /api/products`  

### 📝 Registrations

- `GET /api/registrations`  
- `POST /api/registrations`

---

## 🪪 License

This project is licensed under the MIT License. See the `LICENSE` file for more details.
