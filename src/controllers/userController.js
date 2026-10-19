import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

export const getUser = async (req, res) => {
  const { email } = req.user;

  const user = await User.findOne({ email });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  res.status(200).json(user);
};

export const updateUser = async (req, res) => {
  const { _id } = req.user;
  const { name } = req.body;

  const updatedUser = await User.findByIdAndUpdate(
    _id,
    { name },
    { new: true, runValidators: true },
  );

  if (!updateUser) {
    throw createHttpError(204, 'User not found');
  }

  res.status(200).json(updatedUser);
};

export const updateUserAvatar = async (req, res) => {
  const { file, user } = req;
  if (!file) {
    throw createHttpError(400, 'No file');
  }

  const result = await saveFileToCloudinary(file.buffer, user._id);

  const updatedUser = await User.findOneAndUpdate(
    { _id: user._id },
    { avatar: result.secure_url },
    { returnDocument: 'after' },
  );

  res.status(200).json({ url: updatedUser.avatar });
};
