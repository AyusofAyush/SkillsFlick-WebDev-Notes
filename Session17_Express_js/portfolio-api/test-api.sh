#!/bin/bash

# Portfolio API Testing Script
# This script tests all API endpoints using curl

BASE_URL="http://localhost:4000"
API_URL="$BASE_URL/api"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Print header
print_header() {
    echo ""
    echo -e "${BLUE}╔═══════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║${NC}  $1"
    echo -e "${BLUE}╚═══════════════════════════════════════════╝${NC}"
    echo ""
}

# Print test result
print_test() {
    echo -e "${YELLOW}→${NC} $1"
}

# Print success
print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

# Wait between requests
wait_a_bit() {
    sleep 0.5
}

# Start testing
clear
echo -e "${GREEN}"
echo "╔══════════════════════════════════════════════════════╗"
echo "║                                                      ║"
echo "║         PORTFOLIO API TESTING SCRIPT                 ║"
echo "║         Testing all endpoints...                     ║"
echo "║                                                      ║"
echo "╚══════════════════════════════════════════════════════╝"
echo -e "${NC}"

# ============================================
# HOME & HEALTH CHECKS
# ============================================

print_header "HOME & HEALTH CHECKS"

print_test "Testing home endpoint..."
curl -s "$BASE_URL/" | jq '.'
wait_a_bit

print_test "Testing health check..."
curl -s "$BASE_URL/health" | jq '.'
wait_a_bit

# ============================================
# PROJECTS ENDPOINTS
# ============================================

print_header "PROJECTS ENDPOINTS"

print_test "1. Get all projects"
curl -s "$API_URL/projects" | jq '.'
wait_a_bit

print_test "2. Get projects with pagination (page 1, limit 3)"
curl -s "$API_URL/projects?page=1&limit=3" | jq '.'
wait_a_bit

print_test "3. Filter by technology (React)"
curl -s "$API_URL/projects?tech=react" | jq '.'
wait_a_bit

print_test "4. Filter by category (Frontend)"
curl -s "$API_URL/projects?category=frontend" | jq '.'
wait_a_bit

print_test "5. Get featured projects only"
curl -s "$API_URL/projects?featured=true" | jq '.'
wait_a_bit

print_test "6. Sort by views (descending)"
curl -s "$API_URL/projects?sort=views&order=desc" | jq '.'
wait_a_bit

print_test "7. Get project statistics"
curl -s "$API_URL/projects/stats" | jq '.'
wait_a_bit

print_test "8. Search projects (query: weather)"
curl -s "$API_URL/projects/search?q=weather" | jq '.'
wait_a_bit

print_test "9. Get single project (ID: 1)"
curl -s "$API_URL/projects/1" | jq '.'
wait_a_bit

print_test "10. Get related projects (ID: 1)"
curl -s "$API_URL/projects/1/related" | jq '.'
wait_a_bit

print_test "11. Get non-existent project (ID: 999) - Should return 404"
curl -s "$API_URL/projects/999" | jq '.'
wait_a_bit

print_test "12. Create new project"
curl -s -X POST "$API_URL/projects" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Project",
    "description": "This is a test project created via API",
    "tech": ["Node.js", "Express.js", "Testing"],
    "category": "Backend",
    "featured": false
  }' | jq '.'
wait_a_bit

print_test "13. Create project with missing fields - Should return 400"
curl -s -X POST "$API_URL/projects" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Incomplete Project"
  }' | jq '.'
wait_a_bit

print_test "14. Update project (ID: 1)"
curl -s -X PUT "$API_URL/projects/1" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated E-Commerce Platform",
    "description": "An updated full-stack e-commerce application",
    "tech": ["React", "Node.js", "MongoDB", "Stripe", "Redux"],
    "category": "Full Stack",
    "featured": true
  }' | jq '.'
wait_a_bit

print_test "15. Delete project (ID: 6)"
curl -s -X DELETE "$API_URL/projects/6" | jq '.'
wait_a_bit

# ============================================
# SKILLS ENDPOINTS
# ============================================

print_header "SKILLS ENDPOINTS"

print_test "1. Get all skills"
curl -s "$API_URL/skills" | jq '.'
wait_a_bit

print_test "2. Get skills as flat array"
curl -s "$API_URL/skills/flat" | jq '.'
wait_a_bit

print_test "3. Get skills statistics"
curl -s "$API_URL/skills/stats" | jq '.'
wait_a_bit

print_test "4. Get Frontend skills"
curl -s "$API_URL/skills/frontend" | jq '.'
wait_a_bit

print_test "5. Get Backend skills"
curl -s "$API_URL/skills/backend" | jq '.'
wait_a_bit

print_test "6. Get non-existent category - Should return 404"
curl -s "$API_URL/skills/nonexistent" | jq '.'
wait_a_bit

# ============================================
# ABOUT ENDPOINTS
# ============================================

print_header "ABOUT ENDPOINTS"

print_test "1. Get complete about information"
curl -s "$API_URL/about" | jq '.'
wait_a_bit

print_test "2. Get basic info only"
curl -s "$API_URL/about/basic" | jq '.'
wait_a_bit

print_test "3. Get contact information"
curl -s "$API_URL/about/contact" | jq '.'
wait_a_bit

print_test "4. Get work experience"
curl -s "$API_URL/about/experience" | jq '.'
wait_a_bit

print_test "5. Get education"
curl -s "$API_URL/about/education" | jq '.'
wait_a_bit

print_test "6. Get achievements"
curl -s "$API_URL/about/achievements" | jq '.'
wait_a_bit

# ============================================
# CONTACT ENDPOINTS
# ============================================

print_header "CONTACT ENDPOINTS"

print_test "1. Submit contact form"
curl -s -X POST "$API_URL/contact" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ayush Tester",
    "email": "ayush.raj.tester@example.com",
    "message": "This is a test message from the API testing script. Great API!"
  }' | jq '.'
wait_a_bit

print_test "2. Submit contact with invalid email - Should return 400"
curl -s -X POST "$API_URL/contact" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Invalid User",
    "email": "invalid-email",
    "message": "This should fail validation"
  }' | jq '.'
wait_a_bit

print_test "3. Submit contact with missing fields - Should return 400"
curl -s -X POST "$API_URL/contact" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "No Message User"
  }' | jq '.'
wait_a_bit

print_test "4. Get all contact messages"
curl -s "$API_URL/contact/messages" | jq '.'
wait_a_bit

# ============================================
# ERROR HANDLING
# ============================================

print_header "ERROR HANDLING"

print_test "1. Test 404 - Non-existent endpoint"
curl -s "$API_URL/nonexistent" | jq '.'
wait_a_bit

print_test "2. Test invalid ID parameter"
curl -s "$API_URL/projects/invalid" | jq '.'
wait_a_bit

# ============================================
# SUMMARY
# ============================================

echo ""
echo -e "${GREEN}"
echo "╔══════════════════════════════════════════════════════╗"
echo "║                                                      ║"
echo "║         ✓ ALL TESTS COMPLETED SUCCESSFULLY          ║"
echo "║                                                      ║"
echo "║  Check the output above for detailed responses      ║"
echo "║                                                      ║"
echo "╚══════════════════════════════════════════════════════╝"
echo -e "${NC}"
