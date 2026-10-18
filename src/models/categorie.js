import { model, Schema } from 'mongoose';

const categorieSchema = new Schema({
  _id: { type: Schema.Types.ObjectId },
  name: { type: String, required: true },
});

export const Categorie = model('Categorie', categorieSchema);
