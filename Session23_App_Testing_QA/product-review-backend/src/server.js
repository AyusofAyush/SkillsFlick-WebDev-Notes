require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints:`);
  console.log(`   - GET    /api/products`);
  console.log(`   - GET    /api/products/:id`);
  console.log(`   - POST   /api/products`);
  console.log(`   - PUT    /api/products/:id`);
  console.log(`   - DELETE /api/products/:id`);
  console.log(`   - GET    /api/reviews/:productId`);
  console.log(`   - POST   /api/reviews`);
  console.log(`   - DELETE /api/reviews/:id`);
  console.log(`\n✅ Health check: http://localhost:${PORT}/health`);
});
