// src/server.js
import express from 'express';
import 'dotenv/config';
import cors from 'cors';

import { connectMongoDB } from './db/connectToMongoDB.js';
import { logger } from './middlewares/logger.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import recipeRoutes from './routes/recipeRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { errors } from 'celebrate';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';

const app = express();
const PORT = process.env.PORT ?? 3000;

// Глобальні middleware
app.use(logger); // 1. Логер першим — бачить усі запити
app.use(express.json()); // 2. Парсинг JSON-тіла
app.use(cors()); // 3. Дозвіл для запитів з інших доменів
app.use(cookieParser()); // 4. Парсинг cookie

// підключаємо групу маршрутів рецептів
app.use(recipeRoutes);
app.use(authRoutes);
// Додаємо раути користувача
app.use(userRoutes);

// 404 — якщо маршрут не знайдено
app.use(notFoundHandler);
// обробка помилок від celebrate (валідація)
app.use(errors());
// Error — якщо під час запиту виникла помилка
app.use(errorHandler);

await connectMongoDB();

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
