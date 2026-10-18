import { Router } from 'express';

const router = Router();

router.get('/recipes', (req, res) => {
  res.status(200).json({ message: 'Recipes route works!' });
});

export default router;
