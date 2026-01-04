#!/bin/bash

echo "========================================="
echo "COMPREHENSIVE API GATEWAY TEST"
echo "========================================="
echo ""

BASE_URL="http://localhost:4000/api"

GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

test_count=0
pass_count=0

test_endpoint() {
    test_count=$((test_count + 1))
    echo -e "${BLUE}Test $test_count: $1${NC}"
    
    if eval "$2" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ PASS${NC}"
        pass_count=$((pass_count + 1))
    else
        echo -e "${RED}✗ FAIL${NC}"
        echo "Command: $2"
    fi
    echo ""
}

# Test 1: Gateway Info
test_endpoint "Gateway Info" \
    "curl -s $BASE_URL | grep -q 'Dexa WFH API Gateway'"

# Test 2: Health Check
test_endpoint "Health Check" \
    "curl -s $BASE_URL/health | grep -q '\"status\"'"

# Test 3: Admin Login
echo -e "${BLUE}Getting admin token...${NC}"
ADMIN_TOKEN=$(curl -s -X POST $BASE_URL/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@dexa.com","password":"admin123"}' \
    | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

test_endpoint "Admin Login" \
    "[ ! -z '$ADMIN_TOKEN' ]"

echo "Admin Token: ${ADMIN_TOKEN:0:30}..."
echo ""

# Test 4: Get Profile
test_endpoint "Get Admin Profile" \
    "curl -s $BASE_URL/auth/profile -H 'Authorization: Bearer $ADMIN_TOKEN' | grep -q '\"email\"'"

# Test 5: Get Employees (CRITICAL TEST)
test_endpoint "Get All Employees" \
    "curl -s '$BASE_URL/employees?page=1&limit=10' -H 'Authorization: Bearer $ADMIN_TOKEN' | grep -q '\"data\"'"

# Test 6: Get Employee by ID
test_endpoint "Get Employee by ID" \
    "curl -s $BASE_URL/employees/1 -H 'Authorization: Bearer $ADMIN_TOKEN' | grep -q '\"employeeCode\"'"

# Test 7: Employee Login
echo -e "${BLUE}Getting employee token...${NC}"
EMPLOYEE_TOKEN=$(curl -s -X POST $BASE_URL/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"john.doe@dexa.com","password":"employee123"}' \
    | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

test_endpoint "Employee Login" \
    "[ ! -z '$EMPLOYEE_TOKEN' ]"

# Test 8: Get My Attendances
test_endpoint "Get Employee Attendances" \
    "curl -s $BASE_URL/attendances/my-attendances -H 'Authorization: Bearer $EMPLOYEE_TOKEN' | grep -q '\"data\"'"

# Test 9: Check Today Status
test_endpoint "Check Today Attendance Status" \
    "curl -s $BASE_URL/attendances/today-status -H 'Authorization: Bearer $EMPLOYEE_TOKEN' | grep -q '\"hasClockedIn\"'"

# Test 10: Get All Attendances (Admin)
test_endpoint "Get All Attendances (Admin)" \
    "curl -s '$BASE_URL/attendances?page=1&limit=10' -H 'Authorization: Bearer $ADMIN_TOKEN' | grep -q '\"data\"'"

echo "========================================="
echo -e "RESULTS: ${GREEN}$pass_count/$test_count${NC} tests passed"
echo "========================================="

if [ $pass_count -eq $test_count ]; then
    echo -e "${GREEN}✓ ALL TESTS PASSED!${NC}"
    exit 0
else
    echo -e "${RED}✗ SOME TESTS FAILED!${NC}"
    exit 1
fi