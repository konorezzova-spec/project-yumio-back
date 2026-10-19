import { Schema, model } from 'mongoose';
import { Area } from './area.js';
import { Categorie } from './categorie.js';

const area = await Area.find().select('name -_id');
const areaNames = area.map((tag) => tag.name);

const categorie = await Categorie.find().select('name -_id');
const categorieNames = categorie.map((tag) => tag.name);

const recipeIngredientSchema = new Schema({
  id: {
    type: String,
    ref: 'ingredient',
    required: true,
  },
  measure: {
    type: String,
    required: true,
  },
});

const recipeSchema = new Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true, enum: [...categorieNames] },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    area: { type: String, required: true, enum: [...areaNames] },
    instructions: { type: String, required: true },
    description: { type: String, required: true },
    thumb: { type: String, required: true },
    time: { type: Number, required: true },
    ingredients: {
      type: [recipeIngredientSchema],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Оновлюємо індекс полем owner, щоб пришвидшити пошук рецептів за власником
recipeSchema.index({ owner: 1 });
recipeSchema.index({ category: 'ascending' });

export const Recipe = model('Recipe', recipeSchema);
