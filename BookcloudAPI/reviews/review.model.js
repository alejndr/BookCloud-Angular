const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    body: { type: String, required: true },
    username: { type: String, required: true },
    book: { type: String, required: true },
    rating: { type: Number, required: false },
    updatedAt: { type: Date, default: Date.now },
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Review', schema);
