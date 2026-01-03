#!/bin/bash

echo "========================================="
echo "API GATEWAY TEST"
echo "========================================="
echo ""

BASE_URL="http://localhost:4000/api"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}1. Testing Health Check...${NC}"
HEALTH=$(curl -s $BASE_URL/health)
echo $HEALTH | grep -q '"status":"healthy"'
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Health check passed${NC}"
else
    echo -e "${RED}✗ Health check failed${NC}"
    echo $HEALTH
fi
echo ""

echo -e "${BLUE}2. Testing Login...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@dexa.com","password":"admin123"}')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

if [ ! -z "$TOKEN" ]; then
    echo -e "${GREEN}✓ Login successful${NC}"
    echo "Token: ${TOKEN:0:20}..."
else
    echo -e "${RED}✗ Login failed${NC}"
    echo $LOGIN_RESPONSE
    exit 1
fi
echo ""

echo -e "${BLUE}3. Testing Get Profile...${NC}"
PROFILE=$(curl -s $BASE_URL/auth/profile -H "Authorization: Bearer $TOKEN")
echo $PROFILE | grep -q '"email"'
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Get profile passed${NC}"
else
    echo -e "${RED}✗ Get profile failed${NC}"
    echo $PROFILE
fi
echo ""

echo -e "${BLUE}4. Testing Get Employees...${NC}"
EMPLOYEES=$(curl -s "$BASE_URL/employees?page=1&limit=10" -H "Authorization: Bearer $TOKEN")
echo $EMPLOYEES | grep -q '"data"'
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Get employees passed${NC}"
else
    echo -e "${RED}✗ Get employees failed${NC}"
    echo $EMPLOYEES
fi
echo ""

echo -e "${BLUE}5. Testing Employee Login...${NC}"
EMP_TOKEN=$(curl -s -X POST $BASE_URL/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"john.doe@dexa.com","password":"employee123"}' \
    | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

if [ ! -z "$EMP_TOKEN" ]; then
    echo -e "${GREEN}✓ Employee login successful${NC}"
else
    echo -e "${RED}✗ Employee login failed${NC}"
    exit 1
fi
echo ""

echo -e "${BLUE}6. Testing Get My Attendances...${NC}"
ATTENDANCES=$(curl -s $BASE_URL/attendances/my-attendances -H "Authorization: Bearer $EMP_TOKEN")
echo $ATTENDANCES | grep -q '"data"'
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Get attendances passed${NC}"
else
    echo -e "${RED}✗ Get attendances failed${NC}"
    echo $ATTENDANCES
fi
echo ""

echo "========================================="
echo -e "${GREEN}ALL TESTS COMPLETED!${NC}"
echo "========================================="