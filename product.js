const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    image: { // Ajout de l'image
        type: String,
        required: false, // L'image n'est pas nécessaire si tu veux la rendre optionnelle
    },

});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
