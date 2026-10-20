import createHttpError from 'http-errors';
import { Recipe } from '../models/recipe.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { User } from '../models/user.js';

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

export const addToFavorites = async (req, res) => {
  const { recipeId } = req.params;
  const userId = req.user._id;

  const recipe = await Recipe.exists({ _id: recipeId });

  if (!recipe) {
    throw createHttpError(404, 'Recipe not found');
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { $addToSet: { favorites: recipeId } }, //додали до масиву обраних рецептів, якщо його ще немає
    { new: true }, //повернули оновлений обʼєкт
  );

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  res.status(200).json({
    message: 'Recipe added to favorites',
    favorites: user.favorites,
  });
};

export const removeFromFavorites = async (req, res) => {
  const { recipeId } = req.params;
  const userId = req.user._id;

  const user = await User.findByIdAndUpdate(
    userId,
    // $pull видаляє ID з масиву, якщо він там є.
    { $pull: { favorites: recipeId } },
    { new: true },
  );

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  res.status(200).json({
    message: 'Recipe removed from favorites',
    favorites: user.favorites,
  });
};

export const getFavorites = async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId)
    .select('favorites')
    .populate('favorites');
  //populate('favorites') клієнт отримає повні документи рецептів, а не лише їхні ID
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  res.status(200).json(user.favorites);
};

export const deleteRecipe = async (req, res) => {
  const { recipeId } = req.params;

  const recipe = await Recipe.findOneAndDelete({
    _id: recipeId,
    owner: req.user._id,
  });

  if (!recipe) {
    throw createHttpError(404, 'Recipe not found');
  }

  await User.updateMany(
    { favorites: recipeId },
    { $pull: { favorites: recipeId } },
  );
  // User.updateMany() знаходить усіх користувачів, у яких цей ID є в favorites.
  // $pull видаляє його з масиву кожного знайденого користувача.

  res.status(200).json(recipe);
};
