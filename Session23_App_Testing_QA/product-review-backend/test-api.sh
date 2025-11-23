#!/bin/bash

BASE_URL="http://localhost:4000"

echo "🧪 Testing Product Review API"
echo "================================"

# Health Check
echo -e "\n1️⃣ Health Check"
curl -s $BASE_URL/health | jq

# Get all products
echo -e "\n2️⃣ Get All Products"
curl -s $BASE_URL/api/products | jq

# Create a product
echo -e "\n3️⃣ Create Product"
PRODUCT_RESPONSE=$(curl -s -X POST $BASE_URL/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "description": "Created by test script",
    "price": 99.99,
    "category": "Test"
  }')
echo $PRODUCT_RESPONSE | jq
PRODUCT_ID=$(echo $PRODUCT_RESPONSE | jq -r '.id')

# Get product details
echo -e "\n4️⃣ Get Product Details"
curl -s $BASE_URL/api/products/$PRODUCT_ID | jq

# Create reviews
echo -e "\n5️⃣ Create Review 1"
REVIEW1_RESPONSE=$(curl -s -X POST $BASE_URL/api/reviews \
  -H "Content-Type: application/json" \
  -d "{
    \"productId\": \"$PRODUCT_ID\",
    \"userName\": \"Test User 1\",
    \"rating\": 5,
    \"comment\": \"Excellent product!\"
  }")
echo $REVIEW1_RESPONSE | jq
REVIEW1_ID=$(echo $REVIEW1_RESPONSE | jq -r '.id')

echo -e "\n6️⃣ Create Review 2"
curl -s -X POST $BASE_URL/api/reviews \
  -H "Content-Type: application/json" \
  -d "{
    \"productId\": \"$PRODUCT_ID\",
    \"userName\": \"Test User 2\",
    \"rating\": 4,
    \"comment\": \"Very good!\"
  }" | jq

# Get product with reviews
echo -e "\n7️⃣ Get Product with Reviews"
curl -s $BASE_URL/api/products/$PRODUCT_ID | jq

# Update product
echo -e "\n8️⃣ Update Product"
curl -s -X PUT $BASE_URL/api/products/$PRODUCT_ID \
  -H "Content-Type: application/json" \
  -d '{
    "price": 79.99
  }' | jq

# Delete review
echo -e "\n9️⃣ Delete Review"
curl -s -X DELETE $BASE_URL/api/reviews/$REVIEW1_ID

# Delete product
echo -e "\n🔟 Delete Product"
curl -s -X DELETE $BASE_URL/api/products/$PRODUCT_ID

echo -e "\n✅ Testing Complete!"
