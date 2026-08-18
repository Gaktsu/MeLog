const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = process.env.ANALYSIS_MODEL || 'claude-sonnet-5';

// PRD 12장 "AI 분석 원칙"을 그대로 시스템 프롬프트로 강제한다.
// - 사실과 해석을 분리
// - 말하지 않은 사실(감정/의도)을 만들어내지 않음
// - 하나의 기록으로 적성을 판단하지 않음
// - 가설에는 반드시 불확실성이 포함되어야 함
// - 실행 가능한 "작은" 실험만 제안 (거창한 목표 금지)
const SYSTEM_PROMPT = `당신은 MeLog라는 자기 관찰 서비스의 분석 보조자입니다.
사용자가 오늘 있었던 일을 자유롭게 적은 기록 하나를 받아서, 다음 규칙에 따라 분석합니다.

규칙:
1. 사용자를 판단하거나 성향/적성을 단정하지 않습니다. ("당신은 ~에 적성이 있습니다" 같은 표현 금지)
2. 기록에 없는 감정이나 의도를 지어내지 않습니다. 기록에서 실제로 확인 가능한 것만 씁니다.
3. 단 하나의 기록만으로 결론을 내리지 않습니다. 가설에는 반드시 불확실성을 표현하는 문구
   (예: "~일 가능성이 있다", "현재 기록만으로는 판단하기 어렵다", "추가 사례가 필요하다")를 포함합니다.
4. 다음 작은 실험은 30분~1일 내로 바로 해볼 수 있는 구체적이고 작은 행동이어야 합니다.
   ("~로 취업해보세요" 같은 거창한 제안은 금지합니다.)
5. 반드시 아래 JSON 스키마와 정확히 같은 키를 가진 JSON만 출력합니다.
   설명, 마크다운 코드블록, 그 외 텍스트는 절대 포함하지 않습니다.

출력 스키마:
{
  "observation": "기록에서 객관적으로 확인 가능한 상황 (1~2문장)",
  "emotion": "사용자가 표현한 감정 변화 (예: '답답함 → 만족감', 15자 내외로 간결하게)",
  "behavior": "사용자가 실제로 수행한 행동 (1문장)",
  "hypothesis": "행동과 감정을 근거로 한 잠정적 해석. 반드시 불확실성 표현 포함 (1~2문장)",
  "evidenceLevel": {
    "score": 1,
    "label": "현재 근거가 어느 정도 수준인지 설명 (1문장, 예: '현재 1건의 사례만 존재하여 판단하기엔 이름')"
  },
  "nextExperiment": "가설을 확인하기 위해 시도해볼 수 있는 구체적이고 작은 실험 (1문장)"
}

score는 1~5 사이의 정수이며, 지금은 단일 기록 분석이므로 특별한 근거가 없는 한 1~2를 사용하세요.`;

function stripCodeFence(text) {
  const trimmed = text.trim();
  const fenceMatch = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/);
  return fenceMatch ? fenceMatch[1] : trimmed;
}

function validateShape(obj) {
  const requiredKeys = [
    'observation',
    'emotion',
    'behavior',
    'hypothesis',
    'evidenceLevel',
    'nextExperiment',
  ];
  for (const key of requiredKeys) {
    if (!(key in obj)) throw new Error(`분석 결과에 "${key}" 필드가 없습니다.`);
  }
  if (
    typeof obj.evidenceLevel !== 'object' ||
    typeof obj.evidenceLevel.score !== 'number' ||
    typeof obj.evidenceLevel.label !== 'string'
  ) {
    throw new Error('evidenceLevel 형식이 올바르지 않습니다.');
  }
  obj.evidenceLevel.score = Math.min(5, Math.max(1, Math.round(obj.evidenceLevel.score)));
  return obj;
}

// 기록 content(문자열)를 받아 분석 결과 객체를 반환한다.
// 실패 시 에러를 던진다 — 호출부(routes/entries.js)에서 catch해서
// "분석 실패해도 원본 기록은 보존" 원칙을 지킨다 (PRD 13장).
export async function analyzeEntry(content) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      'ANTHROPIC_API_KEY가 설정되어 있지 않습니다. backend/.env 파일을 확인하세요.'
    );
  }

  const res = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 500,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content }],
    }),
  });

  if (!res.ok) {
    const errBody = await res.text().catch(() => '');
    throw new Error(`Claude API 호출 실패 (${res.status}): ${errBody}`);
  }

  const data = await res.json();
  const textBlock = data.content?.find((b) => b.type === 'text');
  if (!textBlock) throw new Error('분석 응답에서 텍스트를 찾을 수 없습니다.');

  const jsonText = stripCodeFence(textBlock.text);
  let parsed;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    throw new Error('분석 결과를 JSON으로 파싱하지 못했습니다.');
  }

  return validateShape(parsed);
}
