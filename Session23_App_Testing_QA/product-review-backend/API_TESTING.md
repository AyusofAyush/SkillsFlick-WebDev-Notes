# API Testing Guide

## cURL Commands for Testing

### Health Check

```bash
curl http://localhost:4000/health
```

### Products Endpoints

#### 1. Get All Products

```bash
curl http://localhost:4000/api/products
```

#### 2. Get Single Product

```bash
curl http://localhost:4000/api/products/1
```

#### 3. Create New Product

```bash
curl -X POST http://localhost:4000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Gaming Mouse",
    "description": "High-precision gaming mouse with RGB lighting",
    "price": 59.99,
    "category": "Gaming",
    "imageUrl": "https://via.placeholder.com/300x200?text=Gaming+Mouse"
  }'
```

#### 4. Update Product

```bash
curl -X PUT http://localhost:4000/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Laptop Pro 15",
    "price": 1199.99
  }'
```

#### 5. Delete Product

```bash
curl -X DELETE http://localhost:4000/api/products/1
```

### Reviews Endpoints

#### 1. Get Reviews for Product

```bash
curl http://localhost:4000/api/reviews/1
```

#### 2. Create New Review

```bash
curl -X POST http://localhost:4000/api/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "1",
    "userName": "Alice Johnson",
    "rating": 5,
    "comment": "Best laptop I have ever used! Highly recommended."
  }'
```

#### 3. Delete Review

```bash
curl -X DELETE http://localhost:4000/api/reviews/1
```

### Error Testing

#### Invalid Product Creation (Missing Name)

```bash
curl -X POST http://localhost:4000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Test",
    "price": 50,
    "category": "Test"
  }'
```

#### Invalid Review (Rating out of range)

```bash
curl -X POST http://localhost:4000/api/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "1",
    "userName": "Test User",
    "rating": 6,
    "comment": "Invalid rating"
  }'
```

#### Non-existent Product

```bash
curl http://localhost:4000/api/products/nonexistent-id
```

## Complete Test Flow

### 1. Start with Health Check

```bash
curl http://localhost:4000/health
```

### 2. Get Initial Products

```bash
curl http://localhost:4000/api/products
```

### 3. Create a New Product

```bash
curl -X POST http://localhost:4000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "description": "Testing the API",
    "price": 99.99,
    "category": "Test"
  }'
```

**Save the returned product ID for next steps**

### 4. Get Product Details

```bash
curl http://localhost:4000/api/products/{PRODUCT_ID}
```

### 5. Add Reviews

```bash
curl -X POST http://localhost:4000/api/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "{PRODUCT_ID}",
    "userName": "John Doe",
    "rating": 5,
    "comment": "Excellent product!"
  }'

curl -X POST http://localhost:4000/api/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "{PRODUCT_ID}",
    "userName": "Jane Smith",
    "rating": 4,
    "comment": "Very good, would buy again."
  }'
```

### 6. Get Updated Product with Reviews

```bash
curl http://localhost:4000/api/products/{PRODUCT_ID}
```

### 7. Update Product

```bash
curl -X PUT http://localhost:4000/api/products/{PRODUCT_ID} \
  -H "Content-Type: application/json" \
  -d '{
    "price": 79.99
  }'
```

### 8. Delete Review

```bash
curl -X DELETE http://localhost:4000/api/reviews/{REVIEW_ID}
```

### 9. Delete Product

```bash
curl -X DELETE http://localhost:4000/api/products/{PRODUCT_ID}
```

## Shell Script for Automated Testing

Save this as `test-api.sh`:

```bash
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
```

Make it executable:

```bash
chmod +x test-api.sh
./test-api.sh
```
