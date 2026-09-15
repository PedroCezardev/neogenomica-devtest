import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';
import { errorHandler } from './middlewares/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares globais
app.use(cors());
app.use(express.json());

// Health check — testa se a API está de pé
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    message: '🧬 NeoGenomica API está rodando!',
    timestamp: new Date().toISOString(),
  });
});

// Todas as rotas da API
app.use('/api', routes);

// Error handler DEVE ser registrado após as rotas
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🧬 NeoGenomica API rodando em http://localhost:${PORT}`);
});

export default app;
