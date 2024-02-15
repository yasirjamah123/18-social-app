const mongoose = require('mongoose');
const ThoughtSchema = new mongoose.Schema({
    thoughtText: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 280
    },
    username: {
        type: String,
        required: true
    },
    reactions: [{
        reactionId: {
            type: mongoose.Schema.Types.ObjectId,
            default: () => new mongoose.Types.ObjectId()
        },
        reactionBody: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 280
        },
        username: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (createdAt) => createdAt.toISOString()
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now,
        get: (createdAt) => createdAt.toISOString()
    },
});

ThoughtSchema.virtual('reactionCount').get(() => this.reactions.length);

module.exports = mongoose.model('Thought', ThoughtSchema);
