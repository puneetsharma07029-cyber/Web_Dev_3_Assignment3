require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Inventory Management API is running");
});

app.use("/api/products", productRoutes);

// Unknown route response
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Keep error handler after all routes
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
});
