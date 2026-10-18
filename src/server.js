import express from 'express';
import 'dotenv/config';
import cors from 'cors';

import { connectMongoDB } from './db/connectToMongoDB.js';
import { logger } from './middlewares/logger.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import usersRoutes from './routes/usersRoutes.js';
import categoriesRoutes from './routes/categoriesRoutes.js';
import ingredientsRoutes from './routes/ingredientsRoutes.js';
import recipesRoutes from './routes/recipesRoutes.js';
import { errors } from 'celebrate';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

const app = express();
const PORT = process.env.PORT ?? 3000;

// Глобальні middleware
app.use(logger); // Логер першим — бачить усі запити
app.use(helmet()); // Захист HTTP-заголовків
app.use(express.json()); // Парсинг JSON-тіла
app.use(cors()); // Дозвіл для запитів з інших доменів
app.use(cookieParser()); // Парсинг cookie

// підключаємо групу маршрутів
// app.get('/', (req, res, next) => {
//   res.status(200).json({ message: 'Auth route works!' });
// });
app.use('/api', authRoutes);
app.use('/api', usersRoutes);
app.use('/api', categoriesRoutes);
app.use('/api', ingredientsRoutes);
app.use('/api', recipesRoutes);

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
