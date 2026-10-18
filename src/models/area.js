import { model, Schema } from 'mongoose';

const areaSchema = Schema({
  _id: { type: Schema.Types.ObjectId },
  name: { type: String, required: true },
});

export const Area = model('Area', areaSchema);
