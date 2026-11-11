function errorHandler(error, req, res, next) {
  console.log(error);

  if (error.name === "CastError") {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  if (error.code === 11000) {
    return res.status(400).json({ message: "This SKU already exists" });
  }

  if (error.name === "ValidationError") {
    return res.status(400).json({ message: error.message });
  }

  res.status(500).json({
    message: "Something went wrong on the server"
  });
}

module.exports = errorHandler;
