const express = require("express");
const { body } = require("express-validator");
const upload = require("../middleware/upload");
const { protect, admin } = require("../middleware/authMiddleware");
const {
  postProducts,
  getProducts,
  getProductId,
  updateProductId,
  deleteProductId,
} = require("../controllers/productControllers");

const router = express.Router();

router.post(
  "/",
  protect,
  upload.array("image", 5),
  [
    body("name").notEmpty().withMessage("Product name is required"),
    body("price").isFloat({ gt: 0 }).withMessage("Price must be a number"),
    body("category").notEmpty().withMessage("Category is required"),
    body("stock")
      .isInt({ min: 0 })
      .withMessage("Stock must be a positive integer"),
    body("quantity")
      .isInt({ min: 1 })
      .withMessage("Quantity must be at least 1"),
  ],
  postProducts
);

router.put(
  "/:id",
  protect,
  upload.array("images", 5),
  [
    body("price")
      .optional()
      .isFloat({ gt: 0 })
      .withMessage("Price must be a positive number"),
    body("stock")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Stock must be a non-negative integer"),
  ],
  updateProductId
);

router.get("/", getProducts);
router.get("/:id", getProductId);
router.delete("/:id", protect, admin, deleteProductId);

module.exports = router;
