import mongoose from "mongoose";

const monitorSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true, 
        index: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
        maxLength: 100,
    },
    url: {
        type: String,
        required: true,
        trim: true,
    },
    method: {
        type: String,
        enum: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD"],
        default: "GET",
    },
    headers: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
    },
    body:  {
        type: mongoose.Schema.Types.Mixed,
        default: null,
    },
    intervalSeconds: {
        type: Number,
        required: true,
        min: 300,
        default: 300,
    },
    timeoutMs: {
        type: Number,
        required: true,
        min: 1000,
        max: 30000,
        default: 10000,
    },
    expectedStatus: {
        type: Number,
        min: 100,
        max: 599,
        default: 200,
    },
    expectedBodyRule: {
      type: String,
      default: null,
      maxlength: 500,
    },
    latencyThresholdMs: {
      type: Number,
      min: 1,
      default: null,
    },
    failureThreshold: {
      type: Number,
      min: 1,
      default: 3,
    },
    active: {
        type: Boolean,
        default: true,
        index: true,
    },
    status: {
        type: String,
        enum: ["UP", "DOWN", "PAUSED", "UNKNOWN"],
        default: "UNKNOWN",
        index: true,
    },   
},
{
    timestamps: true,
});

monitorSchema.index({userId: 1, createdAt: -1});

export const Monitor = mongoose.model("Monitor", monitorSchema);