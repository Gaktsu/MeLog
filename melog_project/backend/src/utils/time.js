// 서버 시간대와 무관하게 항상 KST(UTC+9) 기준으로 ISO 문자열을 생성한다.
// 예: 2026-08-18T18:12:03.123+09:00
export function nowKST() {
  const KST_OFFSET_MS = 9 * 60 * 60 * 1000;
  const kst = new Date(Date.now() + KST_OFFSET_MS);
  return kst.toISOString().replace('Z', '+09:00');
}
