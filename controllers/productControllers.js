const express = require("express");
const Product = require("../models/productModels");
const { validationResult } = require("express-validator");

const app = express();

exports.postProducts = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const imagePath = req.file ? req.file.path : null;
    const product = await new Product({
      ...req.body,
      image: imagePath, // ✅ Save image if uploaded
    });
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: `Error: ${error.message}` });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: `Error: ${error.message}` });
  }
};

exports.getProductId = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: `Error: ${error.message}` });
  }
};

exports.updateProductId = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // ✅ Fixed this line
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const id = req.params.id;
    const updateProduct = req.body;
    let product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (updateProduct.images) {
      product.images = [...product.images, ...updateProduct.images];
    }
    if (updateProduct.description && product.description) {
      product.description += `${updateProduct.description}`;
    } else if (updateProduct.description) {
      product.description = updateProduct.description;
    }
    if (updateProduct.price) {
      product.price = updateProduct.price;
    }
    if (updateProduct.specs) {
      product.specs = { ...product.specs, ...updateProduct.specs };
    }
    if (req.file) {
      product.image = req.file.path; // ✅ Allow image update
    }
    await product.save();
    res.json({ message: "Product updated successfully", id });
  } catch (error) {
    res.status(500).json({ message: `Error: couldn't update the product` });
  }
};

exports.deleteProductId = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findByIdAndDelete(id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: `Error: ProductId NOT_FOUND` });
  }
};
