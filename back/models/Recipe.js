// models/Recette.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RecipeSchema = new Schema({
    title: String,
    description: String,
    picture: String,
    creationDate: Date,
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category' },
    membreId: {type: Schema.Types.ObjectId, ref: 'Membre'}
});

module.exports = mongoose.model('Recipe', RecipeSchema);