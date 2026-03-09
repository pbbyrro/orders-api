import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { config } from './config/env.js';
import orderRoutes from './routes/orderRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();
const PORT = config.server.port;

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Orders API',
      version: '1.0.0',
      description:
        'API REST para gerenciamento de pedidos com autenticação JWT',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Servidor de desenvolvimento',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{
      bearerAuth: []
    }],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (_req, res) => {
  res.json({
    message: 'Orders API - Server is running',
    documentation: '/api-docs',
    endpoints: {
      auth: '/login',
      orders: '/order',
    },
  });
});

app.use('/', authRoutes);
app.use('/', orderRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada',
    path: req.path,
  });
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error(err);

  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Erro interno do servidor';

  res.status(statusCode).json({
    success: false,
    message,
    stack: err.stack,
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Documentação: http://localhost:${PORT}/api-docs`);
});

export default app;
