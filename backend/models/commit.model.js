const mongoose = require('mongoose')

const commitSchema = new mongoose.Schema({
    commitId: {
        type: String,
        required: true,
        unique: true
    },
    message: {
        type: String,
        required: true
    },
    repository: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Repository',
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    files: [{
        filename: String,
        content: String,
        path: String
    }],
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
})

const Commit = mongoose.model('Commit', commitSchema);

module.exports = { Commit }

