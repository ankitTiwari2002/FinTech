const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema(
    {
        amount: {
            type: Number,
            required: true,
        },
        type: {
            type: String,
            required: true,
            enum: ['income', 'expense'],
        },
        category: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            required: true,
            default: Date.now,
        },
        notes: {
            type: String,
        },
        isDeleted: {
            type: Boolean,
            default: false,
            select: false, // Hide this field by default in queries
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { timestamps: true }
);

// Middleware to automatically filter out soft-deleted records from standard queries
recordSchema.pre(/^find/, function () {
    this.where({ isDeleted: { $ne: true } });
});

// Record Schema finalized
module.exports = mongoose.model('Record', recordSchema);
