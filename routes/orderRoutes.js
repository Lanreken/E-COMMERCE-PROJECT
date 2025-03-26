const express = require("express");
const { protect, admin } = require("../middleware/authMiddleware");
const {
  placeOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderControllers");

const router = express.Router();

router.post("/", protect, placeOrder);
router.get("/", protect, getUserOrders);
router.get("/all", protect, admin, getAllOrders);
router.put("/:id", protect, admin, updateOrderStatus);

module.exports = router;
