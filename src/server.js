import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import './config/db.js';
import routes from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

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
