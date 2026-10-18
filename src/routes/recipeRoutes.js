import { Router } from 'express';

const router = Router();

router.get('/user', (req, res) => {
  res.json({ message: 'User route works!' });
});

export default router;
