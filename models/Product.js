const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      maxlenght: [100, "Name can not be more than 100 characters"],
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    colors: {
      type: [String],
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    miniDescription: {
      type: String,
      maxlenght: [100, "Minidescription cannot be more than 100 characters"]
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

let Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
