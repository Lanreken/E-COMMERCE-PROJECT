const Cart = require("../models/cart");
const Product = require("../models/productModels");

exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ user: req.user.userId });

    if (!cart) {
      cart = new Cart({ user: req.user.userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: `Error: ${error.message}` });
  }
};

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.userId }).populate(
      "items.product"
    );
    if (!cart) {
      return res.status(404).json({ message: "Cart is empty" });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: `Error: ${error.message}` });
  }
};

exports.updateCartItem = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Product not in cart" });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: `Error: ${error.message}` });
  }
};

exports.removeCartItem = async (req, res) => {
  const { productId } = req.body;

  try {
    let cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );
    await cart.save();
    res.json({ message: "Item removed from cart", cart });
  } catch (error) {
    res.status(500).json({ message: `Error: ${error.message}` });
  }
};
