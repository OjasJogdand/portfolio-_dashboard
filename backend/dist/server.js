import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import routes from './routes.js';
const app = express();
const PORT = process.env.PORT || 3001;
// Middleware
app.use(cors());
app.use(express.json());
// API Routes
app.use('/api', routes);
// Start server
app.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
});
