const express = require("express");
const router = express.Router();

const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  restockProduct,
  sellProduct,
  getLowStockProducts,
  getCategorySummary
} = require("../controllers/productController");

// Report routes
router.get("/reports/low-stock", getLowStockProducts);
router.get("/reports/category-summary", getCategorySummary);

// CRUD routes
router.post("/", createProduct);
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

// Stock routes
router.patch("/:id/restock", restockProduct);
router.patch("/:id/sale", sellProduct);

module.exports = router;
