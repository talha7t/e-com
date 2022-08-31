const express = require("express");
const dotenv = require("dotenv").config();
const connectDB = require("./utilities/db");
const errorHandler = require("./middlewares/errors");
// const cors = require("cors");

const PORT = process.env.PORT || 5000;
const app = express();
// app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

connectDB();

// Routes
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
