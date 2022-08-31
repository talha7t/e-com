const Product = require("../models/Product");
const asyncHandler = require("express-async-handler");
const ErrorHandler = require("../utilities/ErrorHandler");
const ApiFeatures = require("../utilities/ApiFeatures");

// @desc    Get all Product
// @route   GET /api/products
// @access  Public

const getProducts = asyncHandler(async (req, res, next) => {
  const total = await Product.countDocuments();

  let query = Product.find();
  const genders = ["men", "women", "kids"];
  let gender = req.query.gender || "all";
  gender === "all" ? (gender = [...genders]) : (gender = req.query.gender);

  if (req.query.category !== undefined) {
    // invalid category
    if (Object.keys(req.query.category).toString() !== gender) {
      return next(
        new ErrorHandler(
          "No selected category exists for selected gender. Please select another category",
          401
        )
      );
    }

    let menCategory =
      req.query.category.men !== undefined ? [req.query.category.men] : "";
    let womenCategory =
      req.query.category.women !== undefined ? [req.query.category.women] : "";
    let kidsCategory =
      req.query.category.kids !== undefined ? [req.query.category.kids] : "";

    const categories = [...menCategory, ...womenCategory, ...kidsCategory];

    // filter
    query = query
      .find({ gender: gender })
      .where(`category.${gender}`)
      .in(...categories);

    const products = await query;

    res.status(200).json({
      success: true,
      totalProducts: total,
      count: products.length,
      products,
    });
  } else {
    // filter
    query = query.find({ gender: gender });
    const products = await query;

    res.status(200).json({
      success: true,
      totalProducts: total,
      count: products.length,
      products,
    });
  }
});

// @desc    Get single product
// @route   GET /api/product/:id
// @access  Public

const getProductDetails = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({ success: true, product });
});

// @desc    Create product
// @route   POST /api/products
// @access  Private

const createProduct = asyncHandler(async (req, res, next) => {
  const product = req.body;
  const newProduct = await Product.create(product);

  res.status(200).json({ success: true, product: newProduct });
});

// @desc    Update a Product
// @route   PUT /api/products/:id
// @access  Private

const updateProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    console.log("product does not exist");
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.status(200).json({ success: true, updatedProduct });
});
// @desc    Get all Product
// @route   DELETE /api/products/:id
// @access  Private

const deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    console.log("no product found");
  }

  await product.remove();
  res.status(200).json({ success: true });
});

module.exports = {
  getProducts,
  getProductDetails,
  createProduct,
  updateProduct,
  deleteProduct,
};
