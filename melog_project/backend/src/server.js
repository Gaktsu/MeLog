import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { initDb } from './db.js';
import { entriesRouter } from './routes/entries.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// API를 /api/v1 으로 버저닝 -> 추후 웹/앱이 같은 API를 공유하기 위함
app.use('/api/v1/entries', entriesRouter);

app.get('/api/v1/health', (req, res) => res.json({ ok: true }));

await initDb();

app.listen(PORT, () => {
  console.log(`MeLog API running on http://localhost:${PORT}`);
});
