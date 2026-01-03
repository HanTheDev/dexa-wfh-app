# System Architecture

## Microservices Design

### Service Communication
```
                    ┌─────────────────┐
                    │   React App     │
                    │  (Port 3000)    │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  API Gateway    │
                    │  (Port 4000)    │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
   ┌────▼─────┐      ┌──────▼──────┐     ┌──────▼──────┐
   │   Auth   │      │  Employee   │     │ Attendance  │
   │ Service  │      │  Service    │     │  Service    │
   │(Port 4001)│     │(Port 4002)  │     │(Port 4003)  │
   └────┬─────┘      └──────┬──────┘     └──────┬──────┘
        │                   │                    │
        └───────────────────┴────────────────────┘
                            │
                    ┌───────▼────────┐
                    │  MySQL DB      │
                    │ dexa_wfh_db    │
                    └────────────────┘
```

## Service Responsibilities

### 1. API Gateway (Port 4000)
- Entry point untuk semua requests
- Route ke appropriate service
- CORS handling
- Rate limiting (optional)

### 2. Auth Service (Port 4001)
Endpoints:
- POST /auth/login
- POST /auth/register
- GET /auth/profile
- POST /auth/refresh-token

### 3. Employee Service (Port 4002)
Endpoints:
- POST /employees
- GET /employees
- GET /employees/:id
- PUT /employees/:id
- DELETE /employees/:id
- GET /employees/search?q=

### 4. Attendance Service (Port 4003)
Endpoints:
- POST /attendances/clock-in (with photo upload)
- PUT /attendances/:id/clock-out
- GET /attendances/employee/:employeeId
- GET /attendances
- GET /attendances/today
- GET /attendances/date/:date

## Database Strategy
- Shared database approach (untuk simplicity)
- Setiap service akses langsung ke MySQL
- Future: bisa dipisah jadi per-service database

## Authentication Flow
1. User login → Auth Service
2. Auth Service return JWT token
3. Frontend simpan token di localStorage
4. Setiap request include token di header
5. API Gateway validate token
6. Forward request ke service