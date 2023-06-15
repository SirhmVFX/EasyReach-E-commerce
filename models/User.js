const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const validator = require("validator");
const Schema = mongoose.Schema;
const autopopulate = require("mongoose-autopopulate");
const UserSchema = new Schema(
  {
    firstname: {
      type: String,
      required: [true, "You must provide a firstname"],
    },
    lastname: {
      type: String,
      required: [true, "You must provide a lastname"],
    },
    email: {
      type: String,
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: "Please provide a valid email address",
      },
    },
    phone: {
      type: Number,
      required: true,
      unique: true,
    },
    location: {
      type: String,
    },
    profilePic: {
      public_id: { type: String },
      url: {
        type: String,
        default:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNL_ZnOTpXSvhf1UaK7beHey2BX42U6solRA&usqp=CAU",
      },
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    password: {
      type: String,
      required: [true, "You must provide a password!"],
      select: false,
    },
  },
  { timestamps: true }
);

UserSchema.plugin(autopopulate);
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (userPassword) {
  const isMatch = await bcrypt.compare(userPassword, this.password);
  return isMatch;
};

let User = mongoose.model("User", UserSchema);

module.exports = User;