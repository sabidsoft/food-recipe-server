const { createRecipeService, getRecipesService, getRecipeService } = require("../services/recipe.service");
const { successResponse } = require("../utils/response");

exports.createRecipe = async (req, res, next) => {
    try {
        const recipe = await createRecipeService(req.body);

        successResponse(res, {
            status: 200,
            message: "New recipe created successfully",
            payload: { recipe }
        })
    }
    catch (err) {
        next(err);
    }
}

exports.getRecipes = async (req, res, next) => {
    try {
        let {
            search = '',
            page = 1,
            limit = 20,
            sort = '-createdAt',
            field = '',
            ...filterObject
        } = req.query;

        filterObject = JSON.stringify(filterObject);
        filterObject = filterObject.replace(/(gt|gte|lt|lte)/g, (value) => "$" + value);
        filterObject = JSON.parse(filterObject);

        let filters = {
            ...filterObject
        };

        // get recipes by search value
        if (search) {
            const searchRegex = new RegExp(".*" + search + ".*", "i");

            filters = {
                ...filterObject,
                $or: [{ recipeName: { $regex: searchRegex } }]
            }
        }

        if (sort) sort = sort.split(',').join(' ');
        if (field) field = field.split(',').join(' ');

        const { recipes, pagination } = await getRecipesService(filters, page, limit, sort, field);

        successResponse(res, {
            status: 200,
            message: "All recipes returned",
            payload: { pagination, recipes }
        })
    }
    catch (err) {
        
        next(err);
    }
}

exports.getRecipe = async (req, res, next) => {
    try {
        const recipe = await getRecipeService(req.params.recipeId);

        successResponse(res, {
            status: 200,
            message: "Recipe returned by id",
            payload: { recipe }
        })
    }
    catch (err) {
        next(err);
    }
}