import { model, Schema } from 'mongoose';

const ingredientSchema = new Schema({
  _id: { type: String },
  name: { type: String, required: true },
  desc: { type: String },
  img: { type: String },
});

export const Ingredient = model('Ingredient', ingredientSchema);
