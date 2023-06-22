const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      maxlength: [100, "Name cannot be more than 100 characters"],
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    colors: [{
      type: String,
      required: true,
    }],
    images: [{
      url: {
        type: String,
      }
    }],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    miniDescription: {
      type: String,
      maxlength: [100, "Mini description cannot be more than 100 characters"]
    },
    description: {
      type: String,
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    }
  },
  { timestamps: true }
);

let Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
