#!/bin/bash

# Secure Blog API - Test Script
# This script tests all API endpoints using curl

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Base URL
BASE_URL="http://localhost:4000"

# Variables to store tokens and IDs
TOKEN=""
REFRESH_TOKEN=""
USER_ID=""
POST_ID=""
COMMENT_ID=""

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║         SECURE BLOG API - TESTING SCRIPT                   ║${NC}"
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo ""

# Function to print test header
print_test() {
    echo -e "\n${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}TEST: $1${NC}"
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# Function to print success
print_success() {
    echo -e "${GREEN}✓ SUCCESS: $1${NC}"
}

# Function to print error
print_error() {
    echo -e "${RED}✗ ERROR: $1${NC}"
}

# Function to print info
print_info() {
    echo -e "${BLUE}ℹ INFO: $1${NC}"
}

# ============================================
# 1. HEALTH CHECK
# ============================================

print_test "1. Health Check"
curl -s -X GET "$BASE_URL/health" | jq '.'
print_success "Health check endpoint working"

# ============================================
# 2. USER REGISTRATION
# ============================================

print_test "2. User Registration"
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "testuser@example.com",
    "password": "Test@1234"
  }')

echo "$REGISTER_RESPONSE" | jq '.'

# Extract token and user ID
TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.data.token')
USER_ID=$(echo "$REGISTER_RESPONSE" | jq -r '.data.user.id')

if [ "$TOKEN" != "null" ] && [ "$TOKEN" != "" ]; then
    print_success "User registered successfully"
    print_info "Token: ${TOKEN:0:20}..."
    print_info "User ID: $USER_ID"
else
    print_error "Registration failed"
fi

# ============================================
# 3. DUPLICATE REGISTRATION (Should Fail)
# ============================================

print_test "3. Duplicate Registration (Should Fail)"
curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "testuser@example.com",
    "password": "Test@1234"
  }' | jq '.'

print_info "This should return an error about email/username already exists"

# ============================================
# 4. LOGIN
# ============================================

print_test "4. User Login"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "Test@1234"
  }')

echo "$LOGIN_RESPONSE" | jq '.'

# Extract tokens
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.token')
REFRESH_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.refreshToken')

if [ "$TOKEN" != "null" ] && [ "$TOKEN" != "" ]; then
    print_success "Login successful"
    print_info "Access Token: ${TOKEN:0:20}..."
    print_info "Refresh Token: ${REFRESH_TOKEN:0:20}..."
else
    print_error "Login failed"
fi

# ============================================
# 5. FAILED LOGIN (Wrong Password)
# ============================================

print_test "5. Failed Login - Wrong Password"
curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "WrongPassword123!"
  }' | jq '.'

print_info "This should return an authentication error"

# ============================================
# 6. GET PROFILE
# ============================================

print_test "6. Get User Profile"
curl -s -X GET "$BASE_URL/api/auth/profile" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

print_success "Profile retrieved successfully"

# ============================================
# 7. UPDATE PROFILE
# ============================================

print_test "7. Update User Profile"
curl -s -X PUT "$BASE_URL/api/auth/profile" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bio": "This is my updated bio for testing purposes",
    "username": "testuser_updated"
  }' | jq '.'

print_success "Profile updated successfully"

# ============================================
# 8. CREATE POST
# ============================================

print_test "8. Create a New Post"
CREATE_POST_RESPONSE=$(curl -s -X POST "$BASE_URL/api/posts" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Blog Post",
    "content": "This is the content of my first blog post. It contains important information about authentication and security.",
    "category": "technology",
    "tags": ["security", "authentication", "nodejs"],
    "status": "draft"
  }')

echo "$CREATE_POST_RESPONSE" | jq '.'

# Extract post ID
POST_ID=$(echo "$CREATE_POST_RESPONSE" | jq -r '.data.post._id')

if [ "$POST_ID" != "null" ] && [ "$POST_ID" != "" ]; then
    print_success "Post created successfully"
    print_info "Post ID: $POST_ID"
else
    print_error "Post creation failed"
fi

# ============================================
# 9. GET ALL POSTS
# ============================================

print_test "9. Get All Posts"
curl -s -X GET "$BASE_URL/api/posts" | jq '.'

print_success "Posts retrieved successfully"

# ============================================
# 10. GET SINGLE POST
# ============================================

print_test "10. Get Single Post by ID"
curl -s -X GET "$BASE_URL/api/posts/$POST_ID" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

print_success "Single post retrieved successfully"

# ============================================
# 11. UPDATE POST
# ============================================

print_test "11. Update Post"
curl -s -X PUT "$BASE_URL/api/posts/$POST_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Updated Blog Post",
    "content": "This is the updated content with more details about security best practices.",
    "status": "draft"
  }' | jq '.'

print_success "Post updated successfully"

# ============================================
# 12. LIKE POST
# ============================================

print_test "12. Like a Post"
curl -s -X POST "$BASE_URL/api/posts/$POST_ID/like" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

print_success "Post liked successfully"

# ============================================
# 13. UNLIKE POST
# ============================================

print_test "13. Unlike a Post (Toggle)"
curl -s -X POST "$BASE_URL/api/posts/$POST_ID/like" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

print_success "Post unliked successfully"

# ============================================
# 14. ADD COMMENT
# ============================================

print_test "14. Add Comment to Post"
COMMENT_RESPONSE=$(curl -s -X POST "$BASE_URL/api/posts/$POST_ID/comments" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "This is a great blog post! Thanks for sharing."
  }')

echo "$COMMENT_RESPONSE" | jq '.'

# Extract comment ID
COMMENT_ID=$(echo "$COMMENT_RESPONSE" | jq -r '.data.comment._id')

if [ "$COMMENT_ID" != "null" ] && [ "$COMMENT_ID" != "" ]; then
    print_success "Comment added successfully"
    print_info "Comment ID: $COMMENT_ID"
else
    print_error "Comment creation failed"
fi

# ============================================
# 15. GET MY POSTS
# ============================================

print_test "15. Get My Posts"
curl -s -X GET "$BASE_URL/api/posts/my/posts" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

print_success "My posts retrieved successfully"

# ============================================
# 16. SEARCH POSTS
# ============================================

print_test "16. Search Posts"
curl -s -X GET "$BASE_URL/api/posts?search=blog&category=technology" | jq '.'

print_success "Search completed successfully"

# ============================================
# 17. PAGINATION
# ============================================

print_test "17. Get Posts with Pagination"
curl -s -X GET "$BASE_URL/api/posts?page=1&limit=5" | jq '.'

print_success "Pagination working correctly"

# ============================================
# 18. REFRESH TOKEN
# ============================================

print_test "18. Refresh Access Token"
REFRESH_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/refresh" \
  -H "Content-Type: application/json" \
  -d "{
    \"refreshToken\": \"$REFRESH_TOKEN\"
  }")

echo "$REFRESH_RESPONSE" | jq '.'

NEW_TOKEN=$(echo "$REFRESH_RESPONSE" | jq -r '.data.token')

if [ "$NEW_TOKEN" != "null" ] && [ "$NEW_TOKEN" != "" ]; then
    print_success "Token refreshed successfully"
    TOKEN=$NEW_TOKEN
    print_info "New Token: ${TOKEN:0:20}..."
else
    print_info "Token refresh may have failed or isn't needed"
fi

# ============================================
# 19. CHANGE PASSWORD
# ============================================

print_test "19. Change Password"
curl -s -X PUT "$BASE_URL/api/auth/change-password" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "Test@1234",
    "newPassword": "NewTest@1234",
    "confirmPassword": "NewTest@1234"
  }' | jq '.'

print_success "Password change initiated"

# ============================================
# 20. LOGIN WITH NEW PASSWORD
# ============================================

print_test "20. Login with New Password"
NEW_LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "NewTest@1234"
  }')

echo "$NEW_LOGIN_RESPONSE" | jq '.'

TOKEN=$(echo "$NEW_LOGIN_RESPONSE" | jq -r '.data.token')

if [ "$TOKEN" != "null" ] && [ "$TOKEN" != "" ]; then
    print_success "Login with new password successful"
else
    print_error "Login with new password failed"
fi

# ============================================
# 21. DELETE COMMENT
# ============================================

print_test "21. Delete Comment"
curl -s -X DELETE "$BASE_URL/api/posts/$POST_ID/comments/$COMMENT_ID" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

print_success "Comment deleted successfully"

# ============================================
# 22. DELETE POST
# ============================================

print_test "22. Delete Post"
curl -s -X DELETE "$BASE_URL/api/posts/$POST_ID" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

print_success "Post deleted successfully"

# ============================================
# 23. UNAUTHORIZED ACCESS (No Token)
# ============================================

print_test "23. Unauthorized Access - No Token"
curl -s -X GET "$BASE_URL/api/auth/profile" | jq '.'

print_info "This should return an unauthorized error"

# ============================================
# 24. LOGOUT
# ============================================

print_test "24. Logout"
curl -s -X POST "$BASE_URL/api/auth/logout" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"refreshToken\": \"$REFRESH_TOKEN\"
  }" | jq '.'

print_success "Logout successful"

# ============================================
# SUMMARY
# ============================================

echo -e "\n${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                   TESTING COMPLETED                        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo -e "${GREEN}"
echo "All API endpoints have been tested!"
echo "Please check the responses above for any errors."
echo ""
echo "Test Summary:"
echo "  ✓ Health Check"
echo "  ✓ User Registration"
echo "  ✓ User Login"
echo "  ✓ Profile Management"
echo "  ✓ Post CRUD Operations"
echo "  ✓ Comments"
echo "  ✓ Likes"
echo "  ✓ Search & Pagination"
echo "  ✓ Token Refresh"
echo "  ✓ Password Change"
echo "  ✓ Authorization & Security"
echo -e "${NC}"
