const { Schema, model } = require("mongoose");

const recipeSchema = new Schema({
    recipeName: {
        type: String,
        required: true,
        trim: true
    },

    recipeImage: {
        type: String,
        required: true,
        trim: true
    },

    recipeDetails: {
        type: String,
        required: true,
        trim: true
    },

    embededYoutubeVideoCode: {
        type: String,
        required: true,
        trim: true
    },
    country: {
        type: String,
        required: true,
        trim: true
    },

    category: {
        type: String,
        required: true,
        trim: true
    },

    creatorEmail: {
        type: String,
        required: true
    },

    watchCount: {
        type: Number,
        default: 0
    },
    purchased_by: {
        type: [String],
        default: []
    }
}, {
    timestamps: true
})

const Recipe = model("Recipe", recipeSchema);

module.exports = Recipe;
