import express, { Application } from "express";
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { setupSwagger } from './docs/swagger_options';
import { errorHandler } from './middlewares/error_handler';
import admin_route from './routes/auth/admin_route';

// const app = express();

const app: Application = express();
app.use(cors());
app.use(express.json());


app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'API is running smoothly',
  });
});

app.use('/api/auth', admin_route);

setupSwagger(app);

// 404 handler for unknown routes
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Route Not Found'});
});


// Error handling middleware
// Note: your errorHandler should have (err, req, res, next) signature
app.use(errorHandler);

export default app;
