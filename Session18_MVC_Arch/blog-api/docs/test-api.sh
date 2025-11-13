#!/bin/bash

# Blog API Testing Script
# Tests all endpoints with various scenarios
# Requires: curl, jq (for JSON formatting)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Configuration
BASE_URL="http://localhost:4000"
API_URL="${BASE_URL}/api/posts"

# Counter for tests
TOTAL_TESTS=0
PASSED_TESTS=0

echo -e "${BOLD}${CYAN}"
echo "╔════════════════════════════════════════════════════════════════════════════╗"
echo "║                       BLOG API TEST SUITE                                  ║"
echo "║                     Testing MVC Architecture                               ║"
echo "╚════════════════════════════════════════════════════════════════════════════╝"
echo -e "${NC}\n"

# Function to print test header
print_test() {
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    echo -e "${BOLD}${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BOLD}${YELLOW}TEST $TOTAL_TESTS: $1${NC}"
    echo -e "${BOLD}${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# Function to check if jq is installed
check_jq() {
    if ! command -v jq &> /dev/null; then
        echo -e "${YELLOW}⚠️  jq is not installed. Installing for better JSON formatting...${NC}"
        echo -e "${CYAN}Response will be shown without formatting.${NC}\n"
        USE_JQ=false
    else
        USE_JQ=true
    fi
}

# Function to format JSON response
format_response() {
    if [ "$USE_JQ" = true ]; then
        echo "$1" | jq '.'
    else
        echo "$1"
    fi
}

# Check for jq
check_jq

# ============================================
# TEST 1: Health Check
# ============================================
print_test "Health Check Endpoint"
echo -e "${CYAN}GET ${BASE_URL}/health${NC}\n"

RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" "${BASE_URL}/health")
HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_STATUS/d')

echo -e "${MAGENTA}Response:${NC}"
format_response "$BODY"
echo -e "\n${MAGENTA}Status Code: ${GREEN}${HTTP_STATUS}${NC}\n"

if [ "$HTTP_STATUS" -eq 200 ]; then
    echo -e "${GREEN}✅ PASSED${NC}\n"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    echo -e "${RED}❌ FAILED${NC}\n"
fi

sleep 1

# ============================================
# TEST 2: Home Page / API Info
# ============================================
print_test "API Information Endpoint"
echo -e "${CYAN}GET ${BASE_URL}/${NC}\n"

RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" "${BASE_URL}/")
HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_STATUS/d')

echo -e "${MAGENTA}Response:${NC}"
format_response "$BODY"
echo -e "\n${MAGENTA}Status Code: ${GREEN}${HTTP_STATUS}${NC}\n"

if [ "$HTTP_STATUS" -eq 200 ]; then
    echo -e "${GREEN}✅ PASSED${NC}\n"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    echo -e "${RED}❌ FAILED${NC}\n"
fi

sleep 1

# ============================================
# TEST 3: Get Categories
# ============================================
print_test "Get Available Categories"
echo -e "${CYAN}GET ${API_URL}/categories${NC}\n"

RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" "${API_URL}/categories")
HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_STATUS/d')

echo -e "${MAGENTA}Response:${NC}"
format_response "$BODY"
echo -e "\n${MAGENTA}Status Code: ${GREEN}${HTTP_STATUS}${NC}\n"

if [ "$HTTP_STATUS" -eq 200 ]; then
    echo -e "${GREEN}✅ PASSED${NC}\n"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    echo -e "${RED}❌ FAILED${NC}\n"
fi

sleep 1

# ============================================
# TEST 4: Create Post #1
# ============================================
print_test "Create First Blog Post"
echo -e "${CYAN}POST ${API_URL}${NC}\n"

POST_DATA_1='{
  "title": "Understanding MVC Architecture in Express.js",
  "content": "MVC (Model-View-Controller) is a software architectural pattern that separates an application into three interconnected components. The Model handles data and business logic, the View presents data to users, and the Controller manages the flow between them. This separation makes code more maintainable, testable, and scalable. In Express.js applications, we implement MVC by organizing our code into models, controllers, and routes directories.",
  "author": "Ayush Raj",
  "category": "Technology",
  "tags": ["MVC", "Express", "Architecture", "Node.js"],
  "published": true
}'

echo -e "${MAGENTA}Request Body:${NC}"
format_response "$POST_DATA_1"
echo ""

RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST "${API_URL}" \
  -H "Content-Type: application/json" \
  -d "$POST_DATA_1")
HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_STATUS/d')

echo -e "${MAGENTA}Response:${NC}"
format_response "$BODY"
echo -e "\n${MAGENTA}Status Code: ${GREEN}${HTTP_STATUS}${NC}\n"

if [ "$HTTP_STATUS" -eq 201 ]; then
    echo -e "${GREEN}✅ PASSED - Post created successfully${NC}\n"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    echo -e "${RED}❌ FAILED${NC}\n"
fi

sleep 1

# ============================================
# TEST 5: Create Post #2
# ============================================
print_test "Create Second Blog Post"
echo -e "${CYAN}POST ${API_URL}${NC}\n"

POST_DATA_2='{
  "title": "RESTful API Design Best Practices",
  "content": "RESTful APIs are the backbone of modern web applications. Following REST principles ensures your API is scalable, maintainable, and easy to use. Key practices include using proper HTTP methods (GET, POST, PUT, DELETE), implementing meaningful resource URLs, using appropriate status codes, versioning your API, implementing proper error handling, and providing clear documentation. Security is also crucial - always validate input, use HTTPS, and implement authentication and authorization.",
  "author": "Jane Smith",
  "category": "Technology",
  "tags": ["REST", "API", "Best Practices", "Web Development"],
  "published": true
}'

RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST "${API_URL}" \
  -H "Content-Type: application/json" \
  -d "$POST_DATA_2")
HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_STATUS/d')

echo -e "${MAGENTA}Response:${NC}"
format_response "$BODY"
echo -e "\n${MAGENTA}Status Code: ${GREEN}${HTTP_STATUS}${NC}\n"

if [ "$HTTP_STATUS" -eq 201 ]; then
    echo -e "${GREEN}✅ PASSED${NC}\n"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    echo -e "${RED}❌ FAILED${NC}\n"
fi

sleep 1

# ============================================
# TEST 6: Create Post #3
# ============================================
print_test "Create Third Blog Post"
echo -e "${CYAN}POST ${API_URL}${NC}\n"

POST_DATA_3='{
  "title": "Getting Started with Node.js Development",
  "content": "Node.js has revolutionized JavaScript development by bringing it to the server-side. Built on Chrome V8 engine, Node.js allows developers to use JavaScript for both frontend and backend development. Its event-driven, non-blocking I/O model makes it efficient and suitable for data-intensive real-time applications. Popular frameworks like Express.js make it easy to build robust web applications and APIs. The npm ecosystem provides thousands of packages to solve common problems.",
  "author": "Mike Johnson",
  "category": "Education",
  "tags": ["Node.js", "JavaScript", "Backend", "Tutorial"],
  "published": true
}'

RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST "${API_URL}" \
  -H "Content-Type: application/json" \
  -d "$POST_DATA_3")
HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)

if [ "$HTTP_STATUS" -eq 201 ]; then
    echo -e "${GREEN}✅ PASSED${NC}\n"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    echo -e "${RED}❌ FAILED${NC}\n"
fi

sleep 1

# ============================================
# TEST 7: Get All Posts
# ============================================
print_test "Get All Posts"
echo -e "${CYAN}GET ${API_URL}${NC}\n"

RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" "${API_URL}")
HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_STATUS/d')

echo -e "${MAGENTA}Response:${NC}"
format_response "$BODY"
echo -e "\n${MAGENTA}Status Code: ${GREEN}${HTTP_STATUS}${NC}\n"

if [ "$HTTP_STATUS" -eq 200 ]; then
    echo -e "${GREEN}✅ PASSED${NC}\n"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    echo -e "${RED}❌ FAILED${NC}\n"
fi

sleep 1

# ============================================
# TEST 8: Get Post by ID
# ============================================
print_test "Get Post by ID (ID: 1)"
echo -e "${CYAN}GET ${API_URL}/1${NC}\n"

RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" "${API_URL}/1")
HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_STATUS/d')

echo -e "${MAGENTA}Response:${NC}"
format_response "$BODY"
echo -e "\n${MAGENTA}Status Code: ${GREEN}${HTTP_STATUS}${NC}\n"

if [ "$HTTP_STATUS" -eq 200 ]; then
    echo -e "${GREEN}✅ PASSED${NC}\n"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    echo -e "${RED}❌ FAILED${NC}\n"
fi

sleep 1

# ============================================
# TEST 9: Filter by Category
# ============================================
print_test "Filter Posts by Category (Technology)"
echo -e "${CYAN}GET ${API_URL}?category=Technology${NC}\n"

RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" "${API_URL}?category=Technology")
HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_STATUS/d')

echo -e "${MAGENTA}Response:${NC}"
format_response "$BODY"
echo -e "\n${MAGENTA}Status Code: ${GREEN}${HTTP_STATUS}${NC}\n"

if [ "$HTTP_STATUS" -eq 200 ]; then
    echo -e "${GREEN}✅ PASSED${NC}\n"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    echo -e "${RED}❌ FAILED${NC}\n"
fi

sleep 1

# ============================================
# TEST 10: Search Posts
# ============================================
print_test "Search Posts (keyword: 'MVC')"
echo -e "${CYAN}GET ${API_URL}/search?q=MVC${NC}\n"

RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" "${API_URL}/search?q=MVC")
HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_STATUS/d')

echo -e "${MAGENTA}Response:${NC}"
format_response "$BODY"
echo -e "\n${MAGENTA}Status Code: ${GREEN}${HTTP_STATUS}${NC}\n"

if [ "$HTTP_STATUS" -eq 200 ]; then
    echo -e "${GREEN}✅ PASSED${NC}\n"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    echo -e "${RED}❌ FAILED${NC}\n"
fi

sleep 1

# ============================================
# TEST 11: Get Statistics
# ============================================
print_test "Get Blog Statistics"
echo -e "${CYAN}GET ${API_URL}/stats${NC}\n"

RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" "${API_URL}/stats")
HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_STATUS/d')

echo -e "${MAGENTA}Response:${NC}"
format_response "$BODY"
echo -e "\n${MAGENTA}Status Code: ${GREEN}${HTTP_STATUS}${NC}\n"

if [ "$HTTP_STATUS" -eq 200 ]; then
    echo -e "${GREEN}✅ PASSED${NC}\n"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    echo -e "${RED}❌ FAILED${NC}\n"
fi

sleep 1

# ============================================
# TEST 12: Like a Post
# ============================================
print_test "Like a Post (ID: 1)"
echo -e "${CYAN}POST ${API_URL}/1/like${NC}\n"

RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST "${API_URL}/1/like")
HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_STATUS/d')

echo -e "${MAGENTA}Response:${NC}"
format_response "$BODY"
echo -e "\n${MAGENTA}Status Code: ${GREEN}${HTTP_STATUS}${NC}\n"

if [ "$HTTP_STATUS" -eq 200 ]; then
    echo -e "${GREEN}✅ PASSED${NC}\n"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    echo -e "${RED}❌ FAILED${NC}\n"
fi

sleep 1

# ============================================
# TEST 13: Update Post
# ============================================
print_test "Update Post (ID: 1)"
echo -e "${CYAN}PUT ${API_URL}/1${NC}\n"

UPDATE_DATA='{
  "title": "Understanding MVC Architecture in Express.js - Updated Edition",
  "content": "MVC (Model-View-Controller) is a software architectural pattern that separates an application into three interconnected components. This updated guide covers advanced MVC concepts, best practices, and real-world examples. Learn how to structure your Express.js applications for maximum maintainability and scalability.",
  "author": "Ayush Raj",
  "category": "Technology",
  "tags": ["MVC", "Express", "Architecture", "Node.js", "Advanced"],
  "published": true
}'

echo -e "${MAGENTA}Request Body:${NC}"
format_response "$UPDATE_DATA"
echo ""

RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X PUT "${API_URL}/1" \
  -H "Content-Type: application/json" \
  -d "$UPDATE_DATA")
HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_STATUS/d')

echo -e "${MAGENTA}Response:${NC}"
format_response "$BODY"
echo -e "\n${MAGENTA}Status Code: ${GREEN}${HTTP_STATUS}${NC}\n"

if [ "$HTTP_STATUS" -eq 200 ]; then
    echo -e "${GREEN}✅ PASSED${NC}\n"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    echo -e "${RED}❌ FAILED${NC}\n"
fi

sleep 1

# ============================================
# TEST 14: Pagination
# ============================================
print_test "Test Pagination (page=1, limit=2)"
echo -e "${CYAN}GET ${API_URL}?page=1&limit=2${NC}\n"

RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" "${API_URL}?page=1&limit=2")
HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_STATUS/d')

echo -e "${MAGENTA}Response:${NC}"
format_response "$BODY"
echo -e "\n${MAGENTA}Status Code: ${GREEN}${HTTP_STATUS}${NC}\n"

if [ "$HTTP_STATUS" -eq 200 ]; then
    echo -e "${GREEN}✅ PASSED${NC}\n"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    echo -e "${RED}❌ FAILED${NC}\n"
fi

sleep 1

# ============================================
# TEST 15: Sort by Popular
# ============================================
print_test "Sort Posts by Popularity"
echo -e "${CYAN}GET ${API_URL}?sortBy=popular${NC}\n"

RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" "${API_URL}?sortBy=popular")
HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_STATUS/d')

echo -e "${MAGENTA}Response:${NC}"
format_response "$BODY"
echo -e "\n${MAGENTA}Status Code: ${GREEN}${HTTP_STATUS}${NC}\n"

if [ "$HTTP_STATUS" -eq 200 ]; then
    echo -e "${GREEN}✅ PASSED${NC}\n"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    echo -e "${RED}❌ FAILED${NC}\n"
fi

sleep 1

# ============================================
# TEST 16: Error - Invalid ID
# ============================================
print_test "Error Handling - Invalid ID"
echo -e "${CYAN}GET ${API_URL}/invalid${NC}\n"

RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" "${API_URL}/invalid")
HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_STATUS/d')

echo -e "${MAGENTA}Response:${NC}"
format_response "$BODY"
echo -e "\n${MAGENTA}Status Code: ${YELLOW}${HTTP_STATUS}${NC}\n"

if [ "$HTTP_STATUS" -eq 400 ]; then
    echo -e "${GREEN}✅ PASSED - Error handled correctly${NC}\n"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    echo -e "${RED}❌ FAILED${NC}\n"
fi

sleep 1

# ============================================
# TEST 17: Error - Post Not Found
# ============================================
print_test "Error Handling - Post Not Found"
echo -e "${CYAN}GET ${API_URL}/999${NC}\n"

RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" "${API_URL}/999")
HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_STATUS/d')

echo -e "${MAGENTA}Response:${NC}"
format_response "$BODY"
echo -e "\n${MAGENTA}Status Code: ${YELLOW}${HTTP_STATUS}${NC}\n"

if [ "$HTTP_STATUS" -eq 404 ]; then
    echo -e "${GREEN}✅ PASSED - 404 error handled correctly${NC}\n"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    echo -e "${RED}❌ FAILED${NC}\n"
fi

sleep 1

# ============================================
# TEST 18: Error - Invalid Route
# ============================================
print_test "Error Handling - Invalid Route"
echo -e "${CYAN}GET ${API_URL}/invalid/route/test${NC}\n"

RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" "${API_URL}/invalid/route/test")
HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_STATUS/d')

echo -e "${MAGENTA}Response:${NC}"
format_response "$BODY"
echo -e "\n${MAGENTA}Status Code: ${YELLOW}${HTTP_STATUS}${NC}\n"

if [ "$HTTP_STATUS" -eq 404 ]; then
    echo -e "${GREEN}✅ PASSED - Invalid route handled${NC}\n"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    echo -e "${RED}❌ FAILED${NC}\n"
fi

sleep 1

# ============================================
# TEST 19: Delete Post
# ============================================
print_test "Delete Post (ID: 3)"
echo -e "${CYAN}DELETE ${API_URL}/3${NC}\n"

RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X DELETE "${API_URL}/3")
HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_STATUS/d')

echo -e "${MAGENTA}Response:${NC}"
format_response "$BODY"
echo -e "\n${MAGENTA}Status Code: ${GREEN}${HTTP_STATUS}${NC}\n"

if [ "$HTTP_STATUS" -eq 200 ]; then
    echo -e "${GREEN}✅ PASSED${NC}\n"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    echo -e "${RED}❌ FAILED${NC}\n"
fi

sleep 1

# ============================================
# TEST 20: Verify Deletion
# ============================================
print_test "Verify Post Deletion"
echo -e "${CYAN}GET ${API_URL}/3${NC}\n"

RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" "${API_URL}/3")
HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_STATUS/d')

echo -e "${MAGENTA}Response:${NC}"
format_response "$BODY"
echo -e "\n${MAGENTA}Status Code: ${YELLOW}${HTTP_STATUS}${NC}\n"

if [ "$HTTP_STATUS" -eq 404 ]; then
    echo -e "${GREEN}✅ PASSED - Post successfully deleted${NC}\n"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    echo -e "${RED}❌ FAILED${NC}\n"
fi

# ============================================
# FINAL SUMMARY
# ============================================
echo -e "\n${BOLD}${CYAN}"
echo "╔════════════════════════════════════════════════════════════════════════════╗"
echo "║                           TEST SUMMARY                                     ║"
echo "╚════════════════════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

PASS_RATE=$((PASSED_TESTS * 100 / TOTAL_TESTS))

echo -e "${BOLD}Total Tests: ${TOTAL_TESTS}${NC}"
echo -e "${GREEN}${BOLD}Passed: ${PASSED_TESTS}${NC}"
echo -e "${RED}${BOLD}Failed: $((TOTAL_TESTS - PASSED_TESTS))${NC}"
echo -e "${CYAN}${BOLD}Pass Rate: ${PASS_RATE}%${NC}\n"

if [ "$PASSED_TESTS" -eq "$TOTAL_TESTS" ]; then
    echo -e "${GREEN}${BOLD}🎉 ALL TESTS PASSED! 🎉${NC}\n"
else
    echo -e "${YELLOW}${BOLD}⚠️  Some tests failed. Please review the output above.${NC}\n"
fi

echo -e "${CYAN}═══════════════════════════════════════════════════════════════════════════════${NC}\n"
