import { Router } from 'express';

const router = Router();

router.get('/users', (req, res) => {
  res.status(200).json({ message: 'Users route works!' });
});

export default router;
