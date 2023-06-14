const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "You must provide a name"],
    },
    description: {
      type: String,
      required: [true, "You must provide a description"],
    },
    picture: {
      public_id: { type: String },
      url: {
        type: String,
        default:
          "https://example.com/default_picture.jpg",
      },
    },
  },
  { timestamps: true }
);

CategorySchema.index({ name: "name" });
let Category = mongoose.model("Category", CategorySchema);

module.exports = Category;
