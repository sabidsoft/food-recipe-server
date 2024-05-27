const createError = require("http-errors");
const { successResponse } = require("../utils/response");
const {
    getUserByEmail,
    googleSignInService,
    getUserById,
    updateUserByIdService,
    updateUserByEmailService
} = require("../services/user.service");
const { generateToken } = require("../utils/generateToken");
const { getRecipeService, updateRecipeService } = require("../services/recipe.service");

exports.googleSignIn = async (req, res, next) => {
    try {
        const { displayName, photoURL, email } = req.body;

        const user = await getUserByEmail(email);

        // old user
        if (user) {
            const token = generateToken({ email }, process.env.JWT_SECRET_KEY, "365d");

            successResponse(res, {
                status: 200,
                message: "Login succefully",
                payload: { user, token }
            });
        }

        // new user
        else {
            const user = await googleSignInService({ displayName, photoURL, email });

            const token = generateToken({ email }, process.env.JWT_SECRET_KEY, "365d");

            successResponse(res, {
                status: 200,
                message: "New user created succefully",
                payload: { user, token }
            });
        }
    }
    catch (err) {
        next(err);
    }
}

exports.updateUserCoin = async (req, res, next) => {
    try {
        const { coin } = req.body;

        if (!coin)
            throw createError(400, "Coin is required.");

        const result = await updateUserByIdService(req.params.userId, { coin });

        if (result.matchedCount === 0)
            throw createError(400, "Failed to update the user profile");

        const user = await getUserById(req.params.userId);

        successResponse(res, {
            status: 200,
            message: "User profile updated successfully",
            payload: { result, user }
        })
    }
    catch (err) {
        next(err);
    }
}

exports.purchasedRecipe = async (req, res, next) => {
    try {
        const { userId, creatorEmail, recipeId } = req.body;

        if (!userId)
            throw createError(400, "User ID is required.");

        if (!creatorEmail)
            throw createError(400, "Creator email is required.");

        if (!recipeId)
            throw createError(400, "Recipe ID is required.");

        const user = await getUserById(userId);
        const newUserCoin = user.coin - 10;
        const userResult = await updateUserByIdService(userId, { coin: newUserCoin });

        const recipeCreator = await getUserByEmail(creatorEmail);
        const newRecipeCreatorCoin = recipeCreator.coin + 1;

        const recipe = await getRecipeService(recipeId);
        const watchCount = recipe.watchCount + 1;
        const purchased_by = recipe.purchased_by ? [...recipe.purchased_by, user.email] : [user.email];

        const recipeResult = await updateRecipeService(recipeId, { watchCount, purchased_by })

        const recipeCreatorResult = await updateUserByEmailService(creatorEmail, { coin: newRecipeCreatorCoin });

        if (userResult.matchedCount === 0)
            throw createError(400, "Failed to update the user coin");

        if (recipeCreatorResult.matchedCount === 0)
            throw createError(400, "Failed to update the recipe creator coin");

        const updatedUser = await getUserById(userId);

        successResponse(res, {
            status: 200,
            message: "User profile updated successfully",
            payload: { result: { userResult, recipeCreatorResult, recipeResult }, user: updatedUser }
        })
    }
    catch (err) {
        next(err);
    }
}

