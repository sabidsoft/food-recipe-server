const Recipe = require("../models/Recipe");

exports.createRecipeService = async (data) => {
    const recipe = await Recipe.create(data);
    return recipe;
}

exports.getRecipesService = async (filters, page, limit, sort, field) => {
    page = parseInt(page);
    limit = parseInt(limit);

    const recipes = await Recipe
        .find(filters)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .select(field);

    const totalDocuments = await Recipe.countDocuments(filters);

    const pagination = {
        totalPage: Math.ceil(totalDocuments / limit),
        currentPage: page,
        previousPage: page - 1 === 0 ? null : page - 1,
        nextPage: page + 1 <= Math.ceil(totalDocuments / limit) ? page + 1 : null
    }

    if (pagination.currentPage > pagination.totalPage) {
        pagination.currentPage = null;
        pagination.previousPage = null;
        pagination.nextPage = null;
    }

    return { recipes, pagination };
}

exports.getRecipeService = async (recipeId) => {
    const recipe = await Recipe.findOne({ _id: recipeId });
    return recipe;
}

exports.updateRecipeService = async (recipeId, data) => {
    const result = await Recipe.updateOne({ _id: recipeId }, { $set: data }, { runValidators: true });
    return result;
}