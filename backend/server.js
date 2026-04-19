import express from 'express';
import cors from 'cors';
import walletRoutes from './routes/wallet.js';
import loansRoutes from './routes/loans.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', walletRoutes);
app.use('/api', loansRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'FintechFlow API is running 🚀' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});