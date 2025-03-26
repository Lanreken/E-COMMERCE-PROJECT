const express = require("express");
const { protect } = require("../middleware/authMiddleware"); // Ensure this is correctly imported
const {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
} = require("../controllers/cartControllers");

const router = express.Router();

router.post("/", protect, addToCart); // Add item to cart
router.get("/", protect, getCart); // Get user's cart
router.put("/", protect, updateCartItem); // Update cart item
router.delete("/", protect, removeCartItem); // Remove item from cart

module.exports = router;
