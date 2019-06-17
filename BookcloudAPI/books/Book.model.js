const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    BookTitulo: { type: String, unique: true, required: true },
    BookSinopsis: { type: String, required: true },
    BookISBN: { type: String, required: true },
    BookPortada: { type: String, required: true },
    BookGenero: { type: String, required: false },
    BookAutor: { type: String, required: true },
    BookPaginas: { type: Number, required: false },
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
    updatedAt: { type: Date, default: Date.now },
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Book', schema);

