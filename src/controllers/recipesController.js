import createHttpError from 'http-errors';
import { Recipe } from '../models/recipe.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

export const getRecipes = async (req, res) => {
  const { page = 1, perPage = 10, category, search } = req.query;

  // Створюємо фільтр
  const filter = {};
  // Фільтрація за категорією
  if (category) {
    filter.category = category;
  }
  // Пошук за назвою та описом рецепта
  if (search) {
    filter.$or = [
      {
        title: {
          $regex: RegExp.escape(search),
          $options: 'i',
        },
      },
      {
        description: {
          $regex: RegExp.escape(search),
          $options: 'i',
        },
      },
    ];
  }

  const skip = (page - 1) * perPage;

  const [recipes, totalItems] = await Promise.all([
    Recipe.find(filter).skip(skip).limit(Number(perPage)),
    Recipe.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalItems / perPage);

  res.status(200).json({
    page: Number(page),
    perPage: Number(perPage),
    totalItems,
    totalPages,
    recipes,
  });
};

export const getMyRecipes = async (req, res) => {
  const { page = 1, perPage = 10, category, search } = req.query;

  // Створюємо фільтр для користувача
  const filter = { owner: req.user._id };
  // Фільтрація за категорією
  if (category) {
    filter.category = category;
  }
  // Пошук за назвою та описом рецепта
  if (search) {
    filter.$or = [
      {
        title: {
          $regex: RegExp.escape(search),
          $options: 'i',
        },
      },
      {
        description: {
          $regex: RegExp.escape(search),
          $options: 'i',
        },
      },
    ];
  }

  const skip = (page - 1) * perPage;

  const [recipes, totalItems] = await Promise.all([
    Recipe.find(filter).skip(skip).limit(Number(perPage)),
    Recipe.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalItems / perPage);

  res.status(200).json({
    page: Number(page),
    perPage: Number(perPage),
    totalItems,
    totalPages,
    recipes,
  });
};

// Отримати одного рецепта за id
export const getRecipeById = async (req, res) => {
  const { recipeId } = req.params;

  const recipe = await Recipe.findOne({
    _id: recipeId,
  });

  if (!recipe) {
    throw createHttpError(404, 'Recipe not found');
  }

  res.status(200).json(recipe);
};

//контролер читає дані з req.body і створює документ через Recipe.create(...)
export const createRecipe = async (req, res) => {
  const recipe = await Recipe.create({
    ...req.body,
    // Додаємо властивість userId
    owner: req.user._id,
  });
  res.status(201).json(recipe);
};

export const updateRecipe = async (req, res) => {
  const { recipeId } = req.params;

  const recipe = await Recipe.findOneAndUpdate(
    // Шукаємо по id рецепта і по id користувача, щоб не можна було оновити чужого рецепта
    { _id: recipeId, owner: req.user._id },
    req.body,
    { returnDocument: 'after' }, // повертаємо оновлений документ
  );

  if (!recipe) {
    throw createHttpError(404, 'Recipe not found');
  }
  res.status(200).json(recipe);
};

export const addRecipeImage = async (req, res) => {
  const { recipeId } = req.params;
  const { file, user } = req;

  if (!file) {
    throw createHttpError(400, 'No file');
  }

  const result = await saveFileToCloudinary(file.buffer, user._id, 'recipe');

  const recipe = await Recipe.findOneAndUpdate(
    { _id: recipeId, owner: req.user._id },
    { thumb: result.secure_url },
    { returnDocument: 'after' }, // повертаємо оновлений документ
  );
  if (!recipe) {
    throw createHttpError(404, 'Recipe not found');
  }

  res.status(200).json(recipe);
};

export const deleteRecipe = async (req, res) => {
  const { recipeId } = req.params;

  const recipe = await Recipe.findOneAndDelete({
    _id: recipeId,
    // Критерій пошуку по userId
    userId: req.user._id,
  });

  if (!recipe) {
    throw createHttpError(404, 'Recipe not found');
  }

  res.status(200).json(recipe);
};
