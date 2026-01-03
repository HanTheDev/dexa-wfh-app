#!/bin/bash

echo "Installing dependencies for all services..."

services=("auth-service" "employee-service" "attendance-service" "api-gateway")

for service in "${services[@]}"
do
    echo "Installing dependencies for $service..."
    cd $service
    
    # Core dependencies
    npm install @nestjs/typeorm typeorm mysql2
    npm install @nestjs/config
    npm install class-validator class-transformer
    
    # Auth specific (install untuk semua, tapi terutama dipakai di auth-service)
    npm install @nestjs/jwt @nestjs/passport passport passport-jwt
    npm install bcrypt
    npm install @types/bcrypt --save-dev
    npm install @types/passport-jwt --save-dev
    
    # File upload (terutama untuk attendance-service)
    npm install @nestjs/platform-express multer
    npm install @types/multer --save-dev
    
    # HTTP client (untuk gateway berkomunikasi dengan services)
    npm install @nestjs/axios axios
    
    echo "$service dependencies installed!"
    cd ..
done

echo "All dependencies installed successfully!"