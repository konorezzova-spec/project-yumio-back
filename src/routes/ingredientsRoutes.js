import { Router } from 'express';

const router = Router();

router.get('/ingredients', (req, res) => {
  res.status(200).json({ message: 'Ingredients route works!' });
});

export default router;
