import { Router } from 'express';

const router = Router();

router.post('/api/auth', (req, res) => {
  res.status(200).json({ message: 'Auth route works!' });
});

export default router;
