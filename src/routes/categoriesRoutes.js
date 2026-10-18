import { Router } from 'express';

const router = Router();

router.get('/categories', (req, res) => {
  res.status(200).json({ message: 'Categories route works!' });
});

export default router;
