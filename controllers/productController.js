const Product = require("../models/Product");

// Create a product
exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    next(error);
  }
};

// Get products with filter, sort and pagination
exports.getAllProducts = async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.name) {
      filter.name = { $regex: req.query.name, $options: "i" };
    }

    const sortBy = req.query.sortBy || "createdAt";
    const order = req.query.order === "desc" ? -1 : 1;
    const allowedFields = ["name", "price", "quantity", "createdAt"];

    if (!allowedFields.includes(sortBy)) {
      return res.status(400).json({
        message: "sortBy must be name, price, quantity or createdAt"
      });
    }

    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100);
    const skip = (page - 1) * limit;

    const products = await Product.find(filter)
      .sort({ [sortBy]: order })
      .skip(skip)
      .limit(limit);

    const totalProducts = await Product.countDocuments(filter);

    res.json({
      page,
      limit,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      products
    });
  } catch (error) {
    next(error);
  }
};

// Get one product by ID
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
};

// Update product details. Change stock with restock/sale routes.
exports.updateProduct = async (req, res, next) => {
  try {
    if (req.body.quantity !== undefined) {
      return res.status(400).json({
        message: "Use restock or sale API to change quantity"
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product updated successfully", product });
  } catch (error) {
    next(error);
  }
};

// Delete product
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// Add stock
exports.restockProduct = async (req, res, next) => {
  try {
    const amount = Number(req.body.quantity);
    if (!Number.isInteger(amount) || amount <= 0) {
      return res.status(400).json({
        message: "quantity must be a positive whole number"
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $inc: { quantity: amount } },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Stock added successfully", product });
  } catch (error) {
    next(error);
  }
};

// Sell stock safely: stock cannot become negative
exports.sellProduct = async (req, res, next) => {
  try {
    const amount = Number(req.body.quantity);
    if (!Number.isInteger(amount) || amount <= 0) {
      return res.status(400).json({
        message: "quantity must be a positive whole number"
      });
    }

    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, quantity: { $gte: amount } },
      { $inc: { quantity: -amount } },
      { new: true, runValidators: true }
    );

    if (!product) {
      const exists = await Product.findById(req.params.id);
      if (!exists) {
        return res.status(404).json({ message: "Product not found" });
      }
      return res.status(400).json({ message: "Not enough stock available" });
    }

    res.json({ message: "Sale completed successfully", product });
  } catch (error) {
    next(error);
  }
};

// Low-stock report
exports.getLowStockProducts = async (req, res, next) => {
  try {
    const products = await Product.find({
      $expr: { $lte: ["$quantity", "$lowStockThreshold"] }
    });
    res.json({ totalLowStockProducts: products.length, products });
  } catch (error) {
    next(error);
  }
};

// Category-wise summary using MongoDB aggregation
exports.getCategorySummary = async (req, res, next) => {
  try {
    const summary = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          totalProducts: { $sum: 1 },
          totalQuantity: { $sum: "$quantity" },
          totalInventoryValue: {
            $sum: { $multiply: ["$price", "$quantity"] }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    res.json(summary);
  } catch (error) {
    next(error);
  }
};
