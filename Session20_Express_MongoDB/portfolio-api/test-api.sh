#!/bin/bash

# Portfolio API Testing Script
# Tests all endpoints with curl commands
# Usage: ./test-api.sh

# Color output for better readability
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

# Configuration
BASE_URL="http://localhost:4000"
API_URL="${BASE_URL}/api/projects"

# Counter for tests
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Store created project ID
PROJECT_ID=""

# Helper function to print section headers
print_header() {
    echo ""
    echo -e "${CYAN}═══════════════════════════════════════════════════════════════════${NC}"
    echo -e "${CYAN}  $1${NC}"
    echo -e "${CYAN}═══════════════════════════════════════════════════════════════════${NC}"
    echo ""
}

# Helper function to print test info
print_test() {
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    echo -e "${YELLOW}[TEST $TOTAL_TESTS]${NC} $1"
    echo -e "${BLUE}Endpoint:${NC} $2"
    echo ""
}

# Helper function to print success
print_success() {
    PASSED_TESTS=$((PASSED_TESTS + 1))
    echo -e "${GREEN}✅ SUCCESS${NC}"
    echo ""
}

# Helper function to print failure
print_failure() {
    FAILED_TESTS=$((FAILED_TESTS + 1))
    echo -e "${RED}❌ FAILED${NC}"
    echo ""
}

# Helper function to wait
wait_for_input() {
    echo -e "${MAGENTA}Press Enter to continue...${NC}"
    read
}

# Start testing
clear
print_header "PORTFOLIO API - COMPREHENSIVE TEST SUITE"
echo -e "${GREEN}API Base URL:${NC} $BASE_URL"
echo -e "${GREEN}Testing started at:${NC} $(date)"
echo ""

# Test 1: Health Check
print_test "Health Check" "GET /health"
RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/health")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
    echo "$BODY" | jq '.'
    print_success
else
    echo "HTTP Status: $HTTP_CODE"
    echo "$BODY"
    print_failure
fi

# Test 2: API Information
print_test "API Information" "GET /"
RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
    echo "$BODY" | jq '.'
    print_success
else
    echo "HTTP Status: $HTTP_CODE"
    echo "$BODY"
    print_failure
fi

# Test 3: Create Project
print_test "Create New Project" "POST /api/projects"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "E-Commerce Platform",
    "description": "A full-stack e-commerce platform built with MERN stack featuring user authentication, product catalog, shopping cart, and payment integration.",
    "technologies": ["MongoDB", "Express.js", "React", "Node.js", "Stripe"],
    "githubUrl": "https://github.com/testuser/ecommerce-platform",
    "liveUrl": "https://myecommerce.example.com",
    "featured": true,
    "status": "completed",
    "priority": "high",
    "startDate": "2024-01-15",
    "endDate": "2024-03-20",
    "tags": ["fullstack", "ecommerce", "mern"]
  }')
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "201" ]; then
    echo "$BODY" | jq '.'
    PROJECT_ID=$(echo "$BODY" | jq -r '.data._id')
    echo -e "${GREEN}Created Project ID:${NC} $PROJECT_ID"
    print_success
else
    echo "HTTP Status: $HTTP_CODE"
    echo "$BODY"
    print_failure
fi

# Test 4: Create Another Project
print_test "Create Second Project" "POST /api/projects"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Weather Dashboard",
    "description": "Real-time weather dashboard using OpenWeather API with location-based forecasts and beautiful visualizations.",
    "technologies": ["React", "TypeScript", "Chart.js", "OpenWeather API"],
    "githubUrl": "https://github.com/testuser/weather-dashboard",
    "featured": false,
    "status": "in-progress",
    "priority": "medium",
    "startDate": "2024-04-01",
    "tags": ["frontend", "api", "typescript"]
  }')
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "201" ]; then
    echo "$BODY" | jq '.'
    print_success
else
    echo "HTTP Status: $HTTP_CODE"
    echo "$BODY"
    print_failure
fi

# Test 5: Get All Projects
print_test "Get All Projects" "GET /api/projects"
RESPONSE=$(curl -s -w "\n%{http_code}" "$API_URL")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
    echo "$BODY" | jq '.'
    print_success
else
    echo "HTTP Status: $HTTP_CODE"
    echo "$BODY"
    print_failure
fi

# Test 6: Get Project by ID
if [ -n "$PROJECT_ID" ]; then
    print_test "Get Project by ID" "GET /api/projects/$PROJECT_ID"
    RESPONSE=$(curl -s -w "\n%{http_code}" "$API_URL/$PROJECT_ID")
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    BODY=$(echo "$RESPONSE" | sed '$d')

    if [ "$HTTP_CODE" = "200" ]; then
        echo "$BODY" | jq '.'
        print_success
    else
        echo "HTTP Status: $HTTP_CODE"
        echo "$BODY"
        print_failure
    fi
fi

# Test 7: Get Featured Projects
print_test "Get Featured Projects" "GET /api/projects/featured/list"
RESPONSE=$(curl -s -w "\n%{http_code}" "$API_URL/featured/list")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
    echo "$BODY" | jq '.'
    print_success
else
    echo "HTTP Status: $HTTP_CODE"
    echo "$BODY"
    print_failure
fi

# Test 8: Get Projects Statistics
print_test "Get Projects Statistics" "GET /api/projects/stats"
RESPONSE=$(curl -s -w "\n%{http_code}" "$API_URL/stats")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
    echo "$BODY" | jq '.'
    print_success
else
    echo "HTTP Status: $HTTP_CODE"
    echo "$BODY"
    print_failure
fi

# Test 9: Search Projects
print_test "Search Projects (keyword: 'commerce')" "GET /api/projects/search?q=commerce"
RESPONSE=$(curl -s -w "\n%{http_code}" "$API_URL/search?q=commerce")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
    echo "$BODY" | jq '.'
    print_success
else
    echo "HTTP Status: $HTTP_CODE"
    echo "$BODY"
    print_failure
fi

# Test 10: Filter by Technology
print_test "Find by Technology (React)" "GET /api/projects/technology/React"
RESPONSE=$(curl -s -w "\n%{http_code}" "$API_URL/technology/React")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
    echo "$BODY" | jq '.'
    print_success
else
    echo "HTTP Status: $HTTP_CODE"
    echo "$BODY"
    print_failure
fi

# Test 11: Filter by Status
print_test "Filter by Status (completed)" "GET /api/projects?status=completed"
RESPONSE=$(curl -s -w "\n%{http_code}" "$API_URL?status=completed")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
    echo "$BODY" | jq '.'
    print_success
else
    echo "HTTP Status: $HTTP_CODE"
    echo "$BODY"
    print_failure
fi

# Test 12: Pagination
print_test "Pagination (page=1, limit=1)" "GET /api/projects?page=1&limit=1"
RESPONSE=$(curl -s -w "\n%{http_code}" "$API_URL?page=1&limit=1")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
    echo "$BODY" | jq '.'
    print_success
else
    echo "HTTP Status: $HTTP_CODE"
    echo "$BODY"
    print_failure
fi

# Test 13: Increment Views
if [ -n "$PROJECT_ID" ]; then
    print_test "Increment Project Views" "POST /api/projects/$PROJECT_ID/view"
    RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/$PROJECT_ID/view")
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    BODY=$(echo "$RESPONSE" | sed '$d')

    if [ "$HTTP_CODE" = "200" ]; then
        echo "$BODY" | jq '.'
        print_success
    else
        echo "HTTP Status: $HTTP_CODE"
        echo "$BODY"
        print_failure
    fi
fi

# Test 14: Increment Likes
if [ -n "$PROJECT_ID" ]; then
    print_test "Increment Project Likes" "POST /api/projects/$PROJECT_ID/like"
    RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/$PROJECT_ID/like")
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    BODY=$(echo "$RESPONSE" | sed '$d')

    if [ "$HTTP_CODE" = "200" ]; then
        echo "$BODY" | jq '.'
        print_success
    else
        echo "HTTP Status: $HTTP_CODE"
        echo "$BODY"
        print_failure
    fi
fi

# Test 15: Toggle Featured
if [ -n "$PROJECT_ID" ]; then
    print_test "Toggle Featured Status" "PATCH /api/projects/$PROJECT_ID/toggle-featured"
    RESPONSE=$(curl -s -w "\n%{http_code}" -X PATCH "$API_URL/$PROJECT_ID/toggle-featured")
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    BODY=$(echo "$RESPONSE" | sed '$d')

    if [ "$HTTP_CODE" = "200" ]; then
        echo "$BODY" | jq '.'
        print_success
    else
        echo "HTTP Status: $HTTP_CODE"
        echo "$BODY"
        print_failure
    fi
fi

# Test 16: Update Status
if [ -n "$PROJECT_ID" ]; then
    print_test "Update Project Status" "PATCH /api/projects/$PROJECT_ID/status"
    RESPONSE=$(curl -s -w "\n%{http_code}" -X PATCH "$API_URL/$PROJECT_ID/status" \
      -H "Content-Type: application/json" \
      -d '{"status": "archived"}')
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    BODY=$(echo "$RESPONSE" | sed '$d')

    if [ "$HTTP_CODE" = "200" ]; then
        echo "$BODY" | jq '.'
        print_success
    else
        echo "HTTP Status: $HTTP_CODE"
        echo "$BODY"
        print_failure
    fi
fi

# Test 17: Update Project
if [ -n "$PROJECT_ID" ]; then
    print_test "Update Project" "PUT /api/projects/$PROJECT_ID"
    RESPONSE=$(curl -s -w "\n%{http_code}" -X PUT "$API_URL/$PROJECT_ID" \
      -H "Content-Type: application/json" \
      -d '{
        "description": "Updated description: A comprehensive full-stack e-commerce platform with advanced features.",
        "priority": "medium"
      }')
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    BODY=$(echo "$RESPONSE" | sed '$d')

    if [ "$HTTP_CODE" = "200" ]; then
        echo "$BODY" | jq '.'
        print_success
    else
        echo "HTTP Status: $HTTP_CODE"
        echo "$BODY"
        print_failure
    fi
fi

# Test 18: Delete Project
if [ -n "$PROJECT_ID" ]; then
    print_test "Delete Project" "DELETE /api/projects/$PROJECT_ID"
    RESPONSE=$(curl -s -w "\n%{http_code}" -X DELETE "$API_URL/$PROJECT_ID")
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    BODY=$(echo "$RESPONSE" | sed '$d')

    if [ "$HTTP_CODE" = "200" ]; then
        echo "$BODY" | jq '.'
        print_success
    else
        echo "HTTP Status: $HTTP_CODE"
        echo "$BODY"
        print_failure
    fi
fi

# Test 19: Invalid ObjectId (Error Handling)
print_test "Error Handling - Invalid ObjectId" "GET /api/projects/invalid-id"
RESPONSE=$(curl -s -w "\n%{http_code}" "$API_URL/invalid-id")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "400" ]; then
    echo "$BODY" | jq '.'
    print_success
else
    echo "HTTP Status: $HTTP_CODE"
    echo "$BODY"
    print_failure
fi

# Test 20: 404 Not Found
print_test "Error Handling - 404 Not Found" "GET /api/nonexistent"
RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/nonexistent")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "404" ]; then
    echo "$BODY" | jq '.'
    print_success
else
    echo "HTTP Status: $HTTP_CODE"
    echo "$BODY"
    print_failure
fi

# Print Summary
print_header "TEST SUMMARY"
echo -e "${CYAN}Total Tests:${NC} $TOTAL_TESTS"
echo -e "${GREEN}Passed:${NC} $PASSED_TESTS"
echo -e "${RED}Failed:${NC} $FAILED_TESTS"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}✅ ALL TESTS PASSED!${NC}"
else
    echo -e "${YELLOW}⚠️  Some tests failed. Please review the output above.${NC}"
fi

echo ""
echo -e "${MAGENTA}Testing completed at:${NC} $(date)"
echo ""
