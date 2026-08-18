import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataFile = path.join(__dirname, '..', 'data', 'db.json');

// 기본 데이터 구조
// entries: Entry[] = { id, content, createdAt, analysis }
// PRD 11장 기준: Entry(사용자 기록) / Analysis(AI 분석) 두 개념을 우선 구현
// analysis는 2단계(AI 분석 기능)에서 채워짐. 지금은 null로 둔다.
const defaultData = { entries: [] };

const adapter = new JSONFile(dataFile);
export const db = new Low(adapter, defaultData);

export async function initDb() {
  await db.read();
  db.data ||= defaultData;
  await db.write();
}
