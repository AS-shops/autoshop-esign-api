const mongoose = require("mongoose");

const contractSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },
    position: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    businessName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    signature: {
      type: String,
      required: false,
    },
    agreed: {
      type: Boolean,
      required: true,
      default: false,
    },
    plan: {
      type: String,
      required: true,
      trim: true,
      enum: [
        "basic",
        "premium",
        "investment",
        "Basic",
        "Premium",
        "Investment",
      ],
    },
    startDate: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "active", "expired", "cancelled"],
      default: "pending",
    },
    notes: {
      type: String,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  },
);

// Index for better query performance
contractSchema.index({ businessName: 1 });
contractSchema.index({ startDate: 1 });
contractSchema.index({ status: 1 });
contractSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Contract", contractSchema);
