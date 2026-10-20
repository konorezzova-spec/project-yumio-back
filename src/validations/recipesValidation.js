import { Joi, Segments } from 'celebrate';
import { isValidObjectId } from 'mongoose';
import { AREA_NAMES, CATEGORY_NAMES } from '../utils/validationData.js';

export const getRecipesSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1),
    perPage: Joi.number().integer().min(5).max(20),
    category: Joi.string().valid(...CATEGORY_NAMES),
    search: Joi.string().trim().allow(''),
    // sortBy: Joi.string().valid('_id', 'category'),
    // sortOrder: Joi.string().valid('asc', 'desc'),
  }),
};

// Кастомний валідатор для ObjectId
const objectIdValidator = (value, helpers) => {
  return !isValidObjectId(value) ? helpers.message('Invalid id format') : value;
};
// Схема для перевірки параметра RecipeId
export const recipeIdParamSchema = {
  [Segments.PARAMS]: Joi.object({
    recipeId: Joi.string().custom(objectIdValidator).required(),
  }),
};

export const createRecipeSchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1).max(64).required().messages({
      'string.base': 'Name must be a string',
      'string.min': 'Name should have at least {#limit} characters',
      'string.max': 'Name should have at most {#limit} characters',
      'any.required': 'Name is required',
    }),
    category: Joi.string()
      .valid(...CATEGORY_NAMES)
      .required()
      .messages({
        'string.base': 'Category must be a string',
        'any.only': `Category must be one of: ${CATEGORY_NAMES.join(', ')}`,
        'any.required': 'Category is required',
      }),
    area: Joi.string()
      .valid(...AREA_NAMES)
      .required()
      .messages({
        'string.base': 'Area must be a string',
        'any.only': `Area must be one of: ${AREA_NAMES.join(', ')}`,
        'any.required': 'Area is required',
      }),
    instructions: Joi.string().max(1200).required().messages({
      'string.base': 'Instructions must be a string',
      'string.max': 'Instructions should have at most {#limit} characters',
      'any.required': 'Instructions is required',
    }),
    description: Joi.string().max(200).required().messages({
      'string.base': 'Description must be a string',
      'string.max': 'Description should have at most {#limit} characters',
      'any.required': 'Description is required',
    }),
    time: Joi.number().min(1).max(360).required().messages({
      'number.base': 'Time must be a number',
      'number.min': 'Time should have at least {#limit} characters',
      'number.max': 'Time should have at most {#limit} characters',
      'any.required': 'Time is required',
    }),
    ingredients: Joi.array()
      .items(
        Joi.object({
          id: Joi.string().max(10),
          measure: Joi.string().max(10),
        }),
      )
      .min(2)
      .max(16)
      .messages({
        'array.base': 'Ingredients must be an array',
        'array.min': 'Ingredients must contain at least {#limit} items',
        'array.max': 'Ingredients must contain at most {#limit} items',
      }),
  }),
};

export const updateRecipeSchema = {
  ...recipeIdParamSchema,
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1).max(64).messages({
      'string.base': 'Name must be a string',
      'string.min': 'Name should have at least {#limit} characters',
      'string.max': 'Name should have at most {#limit} characters',
    }),
    category: Joi.string()
      .valid(...CATEGORY_NAMES)
      .messages({
        'string.base': 'Category must be a string',
        'any.only': `Category must be one of: ${CATEGORY_NAMES.join(', ')}`,
      }),
    area: Joi.string()
      .valid(...AREA_NAMES)
      .messages({
        'string.base': 'Area must be a string',
        'any.only': `Area must be one of: ${AREA_NAMES.join(', ')}`,
      }),
    instructions: Joi.string().max(1200).messages({
      'string.base': 'Instructions must be a string',
      'string.max': 'Instructions should have at most {#limit} characters',
    }),
    description: Joi.string().max(200).messages({
      'string.base': 'Description must be a string',
      'string.max': 'Description should have at most {#limit} characters',
    }),
    time: Joi.number().min(1).max(360).messages({
      'number.base': 'Time must be a number',
      'number.min': 'Time should have at least {#limit} characters',
      'number.max': 'Time should have at most {#limit} characters',
    }),
    ingredients: Joi.array()
      .items(
        Joi.object({
          id: Joi.string().max(10),
          measure: Joi.string().max(10),
        }),
      )
      .min(2)
      .max(16)
      .messages({
        'array.base': 'Ingredients must be an array',
        'array.min': 'Ingredients must contain at least {#limit} items',
        'array.max': 'Ingredients must contain at most {#limit} items',
      }),
  }).min(1), // важливо: не дозволяємо порожнє тіло
};
