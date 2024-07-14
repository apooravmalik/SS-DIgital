import express from 'express';
import cors from 'cors';
import { createFormEntries, getFormEntriesByMagicLink } from '../controllers/formController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

const corsOptions = {
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  optionsSuccessStatus: 200
};

router.use(cors(corsOptions));

// Error handling wrapper
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);


// Route to handle form submission with multiple entries
router.post('/create', authenticateUser, express.json({limit: '50mb'}), asyncHandler(createFormEntries));

// Route to get form entries by magic link or latest entries
router.get('/result/:magicLink?', asyncHandler(getFormEntriesByMagicLink));

export default router;
