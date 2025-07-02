import express, { Application } from "express";
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import bodyParser from "body-parser";
import { setupSwagger } from './docs/swagger_options';
import { errorHandler } from './middlewares/error_handler';
import admin_route from './routes/auth/admin_route';
import plan_route from './routes/products/plan_route';
import product_route from './routes/products/product_route';
import category_route from './routes/products/category_route';
import inventory_route from './routes/products/inventory_route';
import order_route from './routes/products/order_route';
import onboarding_plan_route from './routes/payment/onboarding_plan_route'
import auth_route from './routes/auth/auth_route';
import newUser_route from './routes/auth/newUser_route';
import { handlePaystackWebhook } from './middlewares/handle_paystack-webhook';


const app: Application = express();
app.use(cors());
app.use(express.json());


app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'API is running smoothly',
  });
});

app.post('/api/payments/webhook',
  bodyParser.raw({ type: 'application/json' }), 
  handlePaystackWebhook
);

app.use('/api/auth', admin_route);
app.use('/api/auth', auth_route);
app.use('/api/auth', newUser_route);
app.use('/api', plan_route);
app.use('/api', product_route);
app.use('/api', category_route);
app.use('/api', inventory_route);
app.use('/api', order_route);
app.use('/api/payment', onboarding_plan_route);

setupSwagger(app);

// 404 handler for unknown routes
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Route Not Found'});
});


// Error handling middleware
app.use(errorHandler);

export default app;
