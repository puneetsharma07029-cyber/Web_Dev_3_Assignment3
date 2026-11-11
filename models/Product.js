const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
    trim: true
  },
  sku: {
    type: String,
    required: [true, "SKU is required"],
    unique: true,
    trim: true
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    trim: true
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price cannot be negative"]
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
    min: [0, "Quantity cannot be negative"],
    default: 0
  },
  supplier: {
    type: String,
    trim: true,
    default: ""
  },
  lowStockThreshold: {
    type: Number,
    min: [0, "Low stock threshold cannot be negative"],
    default: 5
  }
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
