const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    otp: { type: String },
    otpExpires: { type: Date },
    role: {
      type: String,
      enum: ["admin", "employee"],
      default: "employee",
    },
    permissions: {
      canCreatePackages: { type: Boolean, default: false },
      canUpdatePackages: { type: Boolean, default: false },
      canDeletePackages: { type: Boolean, default: false },
      canCreateSubPackages: { type: Boolean, default: false },
      canUpdateSubPackages: { type: Boolean, default: false },
      canDeleteSubPackages: { type: Boolean, default: false },
    },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);

// Hash the password before saving the user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model("User", userSchema);
