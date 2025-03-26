const Order = require("../models/order");
const Cart = require("../models/cart");

exports.placeOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.userId }).populate(
      "items.product"
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty" });
    }

    const totalPrice = cart.items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );

    const order = new Order({
      user: req.user.userId,
      items: cart.items,
      totalPrice,
    });

    await order.save();
    await Cart.findOneAndDelete({ user: req.user.userId });

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    res.status(500).json({ message: `Error: ${error.message}` });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId }).populate(
      "items.product"
    );
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: `Error: ${error.message}` });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: `Error: ${error.message}` });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = req.body.status || order.status;
    await order.save();
    res.json({ message: "Order updated successfully", order });
  } catch (error) {
    res.status(500).json({ message: `Error: ${error.message}` });
  }
};
