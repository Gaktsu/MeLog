import { useState } from 'react';
import { reanalyzeEntry } from '../api/entries';

export default function Saved({ entry: initialEntry, onMain, onList }) {
  const [entry, setEntry] = useState(initialEntry);
  const [retrying, setRetrying] = useState(false);
  const [retryError, setRetryError] = useState('');

  async function handleRetry() {
    setRetrying(true);
    setRetryError('');
    try {
      const { entry: updated } = await reanalyzeEntry(entry.id);
      setEntry(updated);
    } catch (e) {
      setRetryError(e.message);
    } finally {
      setRetrying(false);
    }
  }

  const { analysis, analysisError } = entry;

  return (
    <div className="screen">
      <div className="eyebrow">내 기록</div>
      <h1 className="title">기록됐어요.</h1>
      <div className="original">"{entry.content}"</div>

      {analysis ? (
        <>
          <div className="card">
            <div className="k">
              <span className="dot" />
              관찰
            </div>
            <div className="v">{analysis.observation}</div>
          </div>
          <div className="card">
            <div className="k">
              <span className="dot" />
              감정
            </div>
            <div className="v">{analysis.emotion}</div>
          </div>
          <div className="card">
            <div className="k">
              <span className="dot" />
              행동
            </div>
            <div className="v">{analysis.behavior}</div>
          </div>
          <div className="card hyp-card">
            <div className="k">
              <span className="dot amber" />
              가설
            </div>
            <div className="v">{analysis.hypothesis}</div>
          </div>
          <div className="card evidence-card">
            <div className="k">
              <span className="dot sage" />
              근거 수준
            </div>
            <div className="v">{analysis.evidenceLevel.label}</div>
            <div className="meter">
              {[1, 2, 3, 4, 5].map((n) => (
                <span
                  key={n}
                  className={n <= analysis.evidenceLevel.score ? 'fill' : ''}
                />
              ))}
            </div>
          </div>
          <div className="nextexp">
            <div className="k">다음 작은 실험</div>
            {analysis.nextExperiment}
          </div>
        </>
      ) : (
        <div className="card evidence-card">
          <div className="k">
            <span className="dot sage" />
            AI 분석
          </div>
          <div className="v">
            분석에 실패했어요. 원본 기록은 안전하게 저장되어 있어요.
            {analysisError && (
              <>
                <br />
                <span style={{ fontFamily: 'var(--mono)', fontSize: 11 }}>
                  {analysisError}
                </span>
              </>
            )}
          </div>
          {retryError && <div className="error-text">{retryError}</div>}
          <button
            className="btn btn-secondary"
            style={{ marginTop: 12 }}
            onClick={handleRetry}
            disabled={retrying}
          >
            {retrying ? '다시 분석하는 중…' : '다시 분석하기'}
          </button>
        </div>
      )}

      <button className="btn btn-primary" onClick={onList}>
        지난 기록 보기 <span className="btn-arrow">→</span>
      </button>
      <button className="btn btn-secondary" onClick={onMain}>
        메인으로
      </button>
    </div>
  );
}
