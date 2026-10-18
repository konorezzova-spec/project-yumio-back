import { model, Schema } from 'mongoose';

const recipeSchema = new Schema({});

export const Recipe = model('Recipe', recipeSchema);
