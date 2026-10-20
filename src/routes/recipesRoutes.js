import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  getRecipes,
  getMyRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  addRecipeImage,
  deleteRecipe,
} from '../controllers/recipesController.js';
import {
  createRecipeSchema,
  getRecipesSchema,
  recipeIdParamSchema,
  updateRecipeSchema,
} from '../validations/recipesValidation.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/multer.js';

const router = Router();

router.use('/me/recipes', authenticate);

router.get('/recipes', celebrate(getRecipesSchema), getRecipes);
router.get('/recipes/:recipeId', celebrate(recipeIdParamSchema), getRecipeById);

router.get('/me/recipes', celebrate(getRecipesSchema), getMyRecipes);
router.get(
  '/me/recipes/:recipeId',
  celebrate(recipeIdParamSchema),
  getRecipeById,
);
router.post('/me/recipes', celebrate(createRecipeSchema), createRecipe);
router.patch(
  '/me/recipes/:recipeId',
  celebrate(updateRecipeSchema),
  updateRecipe,
);
router.patch(
  '/me/recipes/addimage/:recipeId',
  upload.single('recipe'),
  celebrate(recipeIdParamSchema),
  addRecipeImage,
);

// router.patch('/me/favorite/recipes', celebrate(updateRecipeSchema), addToFavoriteRecipes);
// router.get('/me/favorite/recipes', celebrate(updateRecipeSchema), getFromFavoriteRecipes);

router.delete(
  '/me/recipes/delete/:recipeId',
  authenticate,
  celebrate(recipeIdParamSchema),
  deleteRecipe,
);

export default router;
