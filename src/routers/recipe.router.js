const { createRecipe, getRecipes, getRecipe } = require("../controllers/recipe.controller");
const verifyToken = require("../middlewares/verifyToken");

const router = require("express").Router();

router.get('/', getRecipes);
router.get("/:recipeId", getRecipe);
router.post('/', verifyToken, createRecipe);

module.exports = router;