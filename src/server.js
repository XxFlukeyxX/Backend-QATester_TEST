import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import './config/db.js';
import routes from './routes/index.js';
import path from 'path';
import { fileURLToPath } from 'url';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

const app = express();
const PORT = process.env.PORT || 4000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const swaggerPath = path.join(__dirname, 'swagger.yaml'); 
const swaggerDocument = YAML.load(swaggerPath);

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (_req, res) => res.json({ ok: true, name: 'MediCareAPI' }));
app.use(routes);

app.use((err, req, res, _next) => {
  console.error(err);

  const status = err.status || 500;
  let msg = 'เกิดข้อผิดพลาด';

  if (err.response && err.response.message) {
    msg = err.response.message;
  } else if (err.message) {
    msg = err.message;
  }

  res.status(status).json({ message: msg });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
