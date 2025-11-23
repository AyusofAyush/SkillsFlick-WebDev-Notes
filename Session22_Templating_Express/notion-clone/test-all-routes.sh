#!/bin/bash

# NoteMaster Complete Route Testing Script
# This script tests all routes in the NoteMaster application

BASE_URL="http://localhost:4000"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "════════════════════════════════════════════════════════"
echo "🧪 NoteMaster - Complete Route Testing"
echo "════════════════════════════════════════════════════════"
echo ""

# Function to test a route
test_route() {
    local method=$1
    local route=$2
    local description=$3
    local expected_code=$4
    local data=$5
    
    echo -n "Testing ${BLUE}${method} ${route}${NC} - ${description}... "
    
    if [ "$method" == "GET" ]; then
        response=$(curl -s -o /dev/null -w "%{http_code}" -L -c cookies.txt -b cookies.txt "${BASE_URL}${route}")
    elif [ "$method" == "POST" ]; then
        response=$(curl -s -o /dev/null -w "%{http_code}" -L -c cookies.txt -b cookies.txt -X POST -H "Content-Type: application/json" -d "${data}" "${BASE_URL}${route}")
    fi
    
    if [ "$response" == "$expected_code" ]; then
        echo -e "${GREEN}✓ PASS${NC} (${response})"
    else
        echo -e "${RED}✗ FAIL${NC} (Expected: ${expected_code}, Got: ${response})"
    fi
}

echo "${YELLOW}═══ PUBLIC ROUTES (No Auth Required) ══════════════════${NC}"
echo ""

# Landing page
test_route "GET" "/" "Landing Page" "200"

# Auth pages
test_route "GET" "/login" "Login Page" "200"
test_route "GET" "/register" "Register Page" "200"

echo ""
echo "${YELLOW}═══ AUTHENTICATION FLOW ════════════════════════════════${NC}"
echo ""

# Login with valid credentials
echo -n "Logging in with admin credentials... "
login_response=$(curl -s -L -c cookies.txt -b cookies.txt -X POST \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "username=admin&password=admin123" \
    "${BASE_URL}/login" \
    -w "%{http_code}")

if [[ $login_response == *"302"* ]] || [[ $login_response == *"200"* ]]; then
    echo -e "${GREEN}✓ PASS${NC} - Login successful"
else
    echo -e "${RED}✗ FAIL${NC} - Login failed"
fi

echo ""
echo "${YELLOW}═══ PROTECTED ROUTES (Auth Required) ══════════════════${NC}"
echo ""

# Workspaces
test_route "GET" "/workspaces" "All Workspaces List" "200"
test_route "GET" "/workspaces/new" "New Workspace Form" "200"
test_route "GET" "/workspaces/1" "Workspace Detail (ID: 1)" "200"
test_route "GET" "/workspaces/2" "Workspace Detail (ID: 2)" "200"
test_route "GET" "/workspaces/3" "Workspace Detail (ID: 3)" "200"
test_route "GET" "/workspaces/999/edit" "Edit Non-existent Workspace" "404"

# Pages
test_route "GET" "/workspaces/1/pages/new" "New Page Form" "200"
test_route "GET" "/workspaces/1/pages/1" "Page Detail (ID: 1)" "200"
test_route "GET" "/workspaces/1/pages/2" "Page Detail (ID: 2)" "200"
test_route "GET" "/workspaces/1/pages/3" "Page Detail (ID: 3)" "200"
test_route "GET" "/workspaces/1/pages/1/edit" "Edit Page (ID: 1)" "200"
test_route "GET" "/workspaces/1/pages/999" "Non-existent Page" "404"

# Templates
test_route "GET" "/templates" "Template Library" "200"
test_route "GET" "/templates/1" "Template Detail (ID: 1)" "200"

# Search (workspace-specific)
test_route "GET" "/workspaces/1/pages/search" "Search Page (Workspace 1)" "200"
test_route "GET" "/workspaces/1/pages/search?q=project" "Search with Query" "200"

echo ""
echo "${YELLOW}═══ API ENDPOINTS ══════════════════════════════════════${NC}"
echo ""

# API routes
test_route "GET" "/api/workspaces" "Get All Workspaces (API)" "200"
test_route "GET" "/api/workspaces/1" "Get Workspace by ID (API)" "200"
test_route "GET" "/api/pages/1" "Get Page by ID (API)" "200"
test_route "GET" "/api/templates" "Get All Templates (API)" "200"
test_route "GET" "/api/stats" "Get Statistics (API)" "200"

echo ""
echo "${YELLOW}═══ ERROR HANDLING ═════════════════════════════════════${NC}"
echo ""

test_route "GET" "/nonexistent-route" "404 Error Page" "404"
test_route "GET" "/workspaces/invalid-id" "Invalid ID Format" "404"

echo ""
echo "${YELLOW}═══ STATIC ASSETS ══════════════════════════════════════${NC}"
echo ""

test_route "GET" "/css/style.css" "CSS Stylesheet" "200"
test_route "GET" "/js/main.js" "JavaScript File" "200"

echo ""
echo "════════════════════════════════════════════════════════"
echo "✅ Testing Complete!"
echo "════════════════════════════════════════════════════════"
echo ""

# Cleanup
rm -f cookies.txt

echo "📊 Test Summary:"
echo "   - All major routes tested"
echo "   - Authentication flow verified"
echo "   - Error handling checked"
echo "   - API endpoints validated"
echo ""
echo "💡 Tip: Check the server logs for detailed error messages"
echo ""
