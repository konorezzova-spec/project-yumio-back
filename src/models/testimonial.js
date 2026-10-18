import { model, Schema } from 'mongoose';

const testimonialSchema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, required: true },
    testimonial: { type: String, required: true },
  },
  { timestamps: true },
);

export const Testimonial = model('Testimonial', testimonialSchema);
