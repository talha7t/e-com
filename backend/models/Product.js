const mongoose = require("mongoose");
const ErrorHandler = require("../utilities/ErrorHandler");

const productSchema = new mongoose.Schema(
  {
    model: {
      type: String,
      trim: true,
      unique: true,
      required: [true, "Product model is required"],
      maxLength: [15, "Product model can not exceed 15 characters"],
    },
    name: {
      type: String,
      trim: true,
      required: [true, "Product name is required"],
      maxLength: [30, "Product name can not exceed 30 characters"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      default: 0,
      max: 100000,
      min: 0,
    },
    gender: {
      type: String,
      required: [true, "Please provide the gender for product"],
      enum: {
        values: ["men", "women", "kids"],
        message: "Please select a correct gender for the product",
      },
    },
    category: {
      men: {
        type: String,
        enum: {
          values: ["shirts", "t-shirts", "trousers", "jeans"],
          message: "Please select a correct category for your product",
        },
        requried: function () {
          return !this.category.women || !this.category.kids;
        },
      },
      women: {
        type: String,
        enum: {
          values: ["shirts", "t-shirts", "trousers", "jeans"],
          message: "Please select a correct category for your product",
        },
        requried: function () {
          return !this.category.men || !this.category.kids;
        },
      },
      kids: {
        type: String,
        enum: {
          values: ["shirts", "t-shirts", "trousers", "jeans"],
          message: "Please select a correct category for your product",
        },
        requried: function () {
          return !this.category.men || !this.category.women;
        },
      },
    },
    material: {
      type: String,
      required: [
        true,
        "Please speify the material used for making this product",
      ],
      minLength: [3, "Material name should have atleast 3 characters"],
      maxLength: [25, "Material name can not exceed 25 characters"],
      enum: {
        values: [
          "cotton",
          "fabric",
          "faux leather",
          "faux patent leather",
          "leather",
          "linen",
          "methacrylate",
          "polyster",
          "satin",
          "sock",
          "suede",
        ],
        message: "Please select a correct material for your product",
      },
    },
    inventory: [
      {
        size: {
          type: String,
          required: [true, "Please provide a size for your product"],
          enum: {
            values: [
              "free",
              "0-6M",
              "0-12M",
              "12-18M",
              "18-24M",
              "02-3Y",
              "03-4Y",
              "04-5Y",
              "05-6Y",
              "06-7Y",
              "07-8Y",
              "08-9Y",
              "09-10Y",
              "10-11Y",
              "11-12Y",
              "12-13Y",
              "13-14Y",
              "XS",
              "S",
              "M",
              "L",
              "XL",
              "XXL",
              "24",
              "26",
              "28",
              "30",
              "32",
              "34",
              "36",
              "38",
              "40",
              "42",
              "44",
              "1",
              "2",
              "3",
              "4",
              "5",
              "6",
              "8",
              "9",
              "10",
              "11",
            ],
            message: "Please select a valid size for you product",
          },
        },
        Stock: {
          type: Number,
          required: [true, "Please provide stock for the provided size"],
        },
      },
    ],
    numOfReviews: {
      type: Number,
      default: 0,
    },
    ratings: {
      type: Number,
      default: 0,
      max: 5,
      min: 0,
    },
    productReviews: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
          required: true,
        },
        comment: {
          type: String,
          trim: true,
          maxLength: [500, "Product review can not exceed 500 characters"],
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

productSchema.pre("validate", function (next) {
  if (!this.category.men && !this.category.women && !this.category.kids) {
    return next(
      new ErrorHandler("Please provide at least one value for category", 401)
    );
  }
  if (
    (this.category.men && this.category.women && this.category.kids) ||
    (this.category.women && this.category.kids) ||
    (this.category.men && this.category.kids) ||
    (this.category.women && this.category.men)
  ) {
    return next(
      new ErrorHandler("Please provide only one value for category", 401)
    );
  }
  next();
});

module.exports = mongoose.model("Product", productSchema);
