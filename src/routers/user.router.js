const router = require("express").Router();
const { googleSignIn, updateUserCoin, purchasedRecipe,  } = require("../controllers/user.controller");
const verifyToken = require("../middlewares/verifyToken");

router.post('/create-new-user', googleSignIn);
router.patch("/purchased-recipe", verifyToken, purchasedRecipe);
router.patch("/:userId", verifyToken, updateUserCoin);

module.exports = router;