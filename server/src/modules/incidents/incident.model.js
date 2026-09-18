import mongoose from "mongoose";

const incidentSchema = new mongoose.Schema(
    {
        monitorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Monitor",
            required: true,
            index: true,
        },

        status: {
            type: String,
            enum: ["OPEN", "RESOLVED"],
            default: "OPEN",
            index: true,
        },

        reason: {
            type: String,
            required: true,
            maxlength: 500,
        },

        failureCount: {
            type: Number,
            required: true,
            min: 1,
            default: 1,
        },

        startedAt: {
            type: Date,
            required: true,
        },

        resolvedAt: {
            type: Date,
            default: null,
        },

        durationMs: {
            type: Number,
            min: 0,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

incidentSchema.index({
    monitorId: 1,
    status: 1,
});

incidentSchema.index({
    monitorId: 1,
    startedAt: -1,
});

export const Incident = mongoose.model(
    "Incident",
    incidentSchema
);