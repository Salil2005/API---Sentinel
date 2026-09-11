import mongoose from "mongoose";

const checkResultSchema = new mongoose.Schema(
  {
    monitorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Monitor",
      required: true,
      index: true,
    },

    checkedAt: {
      type: Date,
      required: true,
      index: true,
    },

    success: {
      type: Boolean,
      required: true,
    },

    statusCode: {
      type: Number,
      min: 100,
      max: 599,
      default: null,
    },

    responseTimeMs: {
      type: Number,
      min: 0,
      default: null,
    },

    errorType: {
      type: String,
      default: null,
    },

    errorMessage: {
      type: String,
      default: null,
      maxlength: 500,
    },

    bodyValidationPassed: {
      type: Boolean,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

checkResultSchema.index({
  monitorId: 1,
  checkedAt: -1,
});

export const CheckResult = mongoose.model("CheckResult",checkResultSchema);
