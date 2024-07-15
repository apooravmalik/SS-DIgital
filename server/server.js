import express from 'express';
// import path from 'path';
// import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cors from 'cors';
import formRoutes from './routes/formRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const app = express();

const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:4173',  // Add this line
    'https://ss-digital.vercel.app'  // Add your Vercel deployment URL
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.get("/", (req, res) =>{
  return res.json({ message: "Server is running" });
})

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Increase the payload size limit to 50MB
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/formgenerator', formRoutes);
app.use('/api/auth', authRoutes);

// Add a middleware to check payload size
app.use((req, res, next) => {
  if (req.headers['content-length'] > 52428800) { // 50MB in bytes
    return res.status(413).send('Payload too large');
  }
  next();
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});