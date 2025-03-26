const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    quantity: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

// module.exports = mongoose.model("Product", productSchema);

const Product = mongoose.model("Product", productSchema);
// i used because of clarity and incase i want to debug the product schema
console.log(Product);
module.exports = Product;
