import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import { db } from '../db.js';
import { nowKST } from '../utils/time.js';

export const entriesRouter = Router();

// 목록 조회 - 날짜, 내용 일부, (있다면) 주요 감정만 반환 (PRD 6.4)
entriesRouter.get('/', async (req, res) => {
  await db.read();
  const list = [...db.data.entries]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map((e) => ({
      id: e.id,
      createdAt: e.createdAt,
      snippet: e.content.length > 40 ? e.content.slice(0, 40) + '…' : e.content,
      mainEmotion: e.analysis?.emotion ?? null,
    }));
  res.json({ entries: list });
});

// 상세 조회 - 원본 + 분석 결과 전체 (PRD 6.4)
entriesRouter.get('/:id', async (req, res) => {
  await db.read();
  const entry = db.data.entries.find((e) => e.id === req.params.id);
  if (!entry) return res.status(404).json({ error: 'Entry not found' });
  res.json({ entry });
});

// 기록 작성 (PRD 6.1) - content, createdAt만 필수. analysis는 2단계 이후 채워짐.
entriesRouter.post('/', async (req, res) => {
  const { content } = req.body ?? {};

  if (typeof content !== 'string' || content.trim().length === 0) {
    return res.status(400).json({ error: '기록 내용을 입력해주세요.' });
  }
  if (content.length > 5000) {
    return res.status(400).json({ error: '기록이 너무 깁니다. (최대 5000자)' });
  }

  const entry = {
    id: randomUUID(),
    content: content.trim(),
    createdAt: nowKST(),
    // AI 오류 대응 원칙(PRD 13장): 분석 실패해도 원본 기록은 보존되어야 하므로
    // 저장과 분석을 분리하고, analysis는 기본적으로 null 상태로 시작한다.
    analysis: null,
  };

  await db.read();
  db.data.entries.push(entry);
  await db.write();

  res.status(201).json({ entry });
});
