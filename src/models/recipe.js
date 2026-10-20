import { Schema, model } from 'mongoose';

const recipeIngredientSchema = new Schema({
  id: {
    type: String,
    ref: 'ingredient',
    // required: true,
  },
  measure: {
    type: String,
    // required: true,
  },
});

const recipeSchema = new Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    area: { type: String, required: true },
    instructions: { type: String, required: true },
    description: { type: String, required: true },
    thumb: {
      type: String,
      required: false,
    },
    time: { type: Number, required: true },
    ingredients: {
      type: [recipeIngredientSchema],
      // required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Оновлюємо індекс полем owner, щоб пришвидшити пошук рецептів за власником
recipeSchema.index({ owner: 1 });
recipeSchema.index({ category: 1 });

export const Recipe = model('Recipe', recipeSchema);
