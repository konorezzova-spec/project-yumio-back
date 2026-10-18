import { model, Schema } from 'mongoose';

const userSchema = new Schema(
  {
    name: { type: String, required: false },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },

    avatar: {
      type: String,
      required: false,
      default: 'https://ac.goit.global/fullstack/react/default-avatar.jpg',
    },
  },
  { timestamps: true },
);

userSchema.pre('save', function () {
  if (!this.username) {
    this.username = this.email;
  }
});

// Перевизначаємо метод toJSON (видаляємо пароль з відповіді)
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const User = model('User', userSchema);
