# MeLog — 1~2단계: 기록 작성 + AI 분석

PRD 기준 개발 우선순위 1단계(기록 작성), 2단계(AI 분석)까지 구현되어 있습니다.
기록을 저장하면 Claude API가 PRD 12장 원칙(사실과 해석 분리, 단정 금지, 불확실성 명시,
작은 실험 제안)에 따라 분석하고, 그 결과를 함께 저장합니다.

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
cp .env.example .env   # ANTHROPIC_API_KEY 값을 채워넣으세요
npm install
npm run dev
```

`http://localhost:4000` 에서 API가 뜹니다. 데이터는 `backend/data/db.json` 파일에 저장됩니다.
(나중에 PostgreSQL 등으로 옮길 때는 `src/db.js` 한 파일만 교체하면 되도록 분리해뒀습니다.)

`ANTHROPIC_API_KEY`를 설정하지 않으면 기록은 정상 저장되지만 분석은 실패 처리되고
(`analysis: null`, `analysisError`에 사유 기록), 프론트엔드에는 "다시 분석하기" 버튼이 뜹니다.
원본 기록이 분석 실패 때문에 사라지는 일은 없습니다 (PRD 13장 원칙).

### 2. 프론트엔드

```bash
cd frontend
cp .env.example .env   # 필요하면 API 주소 수정
npm install
npm run dev
```

`http://localhost:5173` 에서 화면을 확인할 수 있습니다.

## API

| Method | Path                          | 설명 |
|--------|--------------------------------|------|
| POST   | /api/v1/entries                | 기록 작성 (content 필수) → 저장 후 자동으로 AI 분석 시도 |
| GET    | /api/v1/entries                | 기록 목록 (날짜, 일부 내용, 주요 감정) |
| GET    | /api/v1/entries/:id             | 기록 상세 (원본 + 분석 결과) |
| POST   | /api/v1/entries/:id/reanalyze   | 분석 재시도 |

### analysis 필드 형태

```json
{
  "observation": "기록에서 객관적으로 확인 가능한 상황",
  "emotion": "답답함 → 만족감",
  "behavior": "사용자가 실제로 수행한 행동",
  "hypothesis": "~일 가능성이 있다 (반드시 불확실성 포함)",
  "evidenceLevel": { "score": 1, "label": "현재 근거 수준 설명" },
  "nextExperiment": "다음에 시도해볼 구체적이고 작은 실험"
}
```

## 다음 단계 (3~5단계)

- 3단계는 이미 2단계 구현에 포함됨 (기록+분석 결과를 함께 저장)
- 4단계(목록 조회), 5단계(상세 조회) API는 이미 구현되어 있고, 프론트엔드 화면도 연결되어 있음
- 남은 것: 여러 기록을 넘나드는 패턴 분석, Hypothesis/Experiment 개념 도입 (PRD 10장, 11장 — MVP 이후 확장 범위)
