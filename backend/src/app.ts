import express, { Application } from "express";
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { setupSwagger } from './docs/swagger_options';
import { errorHandler } from './middlewares/error_handler';
import admin_route from './routes/auth/admin_route';
import plan_route from './routes/products/plan_route';
import onboarding_plan_route from './routes/payment/onboarding_plan_route'
import auth_route from './routes/auth/auth_route'
// const app = express();

const app: Application = express();
app.use(cors());
app.use(express.json());


app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'API is running smoothly',
  });
});

// Custom middleware to conditionally parse JSON
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.originalUrl === '/api/payment/webhook') {
    // Skip JSON parsing for raw Paystack webhook
    next();
  } else {
    express.json()(req, res, next); // Parse normally for others
  }
});

// Raw body parsing only for webhook
app.post(
  '/api/payment/webhook',
  express.raw({ type: 'application/json' }), // Capture raw body
  (req: Request, res: Response, next: NextFunction) => {
    // Attach parsed body so controller can still use req.parsedBody
    (req as any).parsedBody = JSON.parse(req.body.toString('utf8'));
    next();
  }
);

app.use('/api/auth', admin_route);
app.use('/api/auth', auth_route);
app.use('/api', plan_route);
app.use('/api/payment', onboarding_plan_route);

setupSwagger(app);

// 404 handler for unknown routes
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Route Not Found'});
});


// Error handling middleware
app.use(errorHandler);

export default app;
