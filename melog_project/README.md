# MeLog — 1단계: 기록 작성 기능

PRD 기준 개발 우선순위 1단계(기록 작성)를 실제로 동작하는 형태로 구현한 것입니다.
지금은 **기록을 쓰고 저장하는 것까지**만 동작합니다. AI 분석(2단계)은 아직 연결되어 있지 않고,
그 자리(`analysis` 필드)는 미리 비워둔 상태입니다.

## 구조

```
melog/
  backend/     # Express API 서버, JSON 파일(lowdb) 저장소
  frontend/    # React(Vite) 웹 클라이언트
```

웹과 앱이 같은 백엔드 API를 쓸 수 있도록, API는 `/api/v1/entries` 로 버전을 붙여뒀습니다.
나중에 React Native 등으로 앱을 만들 때 프론트엔드만 새로 만들고 백엔드는 그대로 재사용하면 됩니다.

## 실행 방법

### 1. 백엔드

```bash
cd backend
npm install
npm run dev
```

`http://localhost:4000` 에서 API가 뜹니다. 데이터는 `backend/data/db.json` 파일에 저장됩니다.
(나중에 PostgreSQL 등으로 옮길 때는 `src/db.js` 한 파일만 교체하면 되도록 분리해뒀습니다.)

### 2. 프론트엔드

```bash
cd frontend
cp .env.example .env   # 필요하면 API 주소 수정
npm install
npm run dev
```

`http://localhost:5173` 에서 화면을 확인할 수 있습니다.

## API

| Method | Path                  | 설명 |
|--------|------------------------|------|
| POST   | /api/v1/entries        | 기록 작성 (content 필수) |
| GET    | /api/v1/entries        | 기록 목록 (날짜, 일부 내용, 주요 감정) |
| GET    | /api/v1/entries/:id    | 기록 상세 (원본 + 분석 결과) |

## 다음 단계 (2단계: AI 분석)

`backend/src/routes/entries.js`의 `POST /` 핸들러에서 `analysis: null`로 저장하는 부분이
AI 분석 결과가 들어갈 자리입니다. 다음 단계에서는:

1. 기록 저장 직후(or 별도 비동기 처리로) AI 분석 API를 호출
2. 결과를 `analysis` 필드에 `{ observation, emotion, behavior, hypothesis, evidenceLevel, nextExperiment }` 형태로 채워서 저장
3. 분석 실패 시에도 원본 기록(`content`)은 이미 저장되어 있으므로 데이터 유실 없음 (PRD 13장 원칙 반영)

프론트엔드에서는 `Saved.jsx` 화면이 지금은 "분석 기능이 아직 연결되지 않았다"는 안내만 보여주는데,
2단계가 붙으면 이 화면이 목업의 "분석 결과" 화면으로 교체됩니다.
