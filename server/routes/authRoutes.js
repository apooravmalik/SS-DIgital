import express from 'express';
import { login, signup } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    console.log('Login request body:', req.body);
    await login(req, res);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/signup', async (req, res) => {
  try {
    console.log('Signup request body:', req.body);
    await signup(req, res);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
