import { useEffect, useState } from 'react';
import { getEntry, reanalyzeEntry } from '../api/entries';

export default function Detail({ entryId, onBack }) {
  const [entry, setEntry] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState('');

  useEffect(() => {
    setStatus('loading');
    getEntry(entryId)
      .then(({ entry }) => {
        setEntry(entry);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, [entryId]);

  async function handleAnalyze() {
    setAnalyzing(true);
    setAnalyzeError('');
    try {
      const { entry: updated } = await reanalyzeEntry(entryId);
      setEntry(updated);
    } catch (e) {
      setAnalyzeError(e.message);
    } finally {
      setAnalyzing(false);
    }
  }

  return (
    <div className="screen">
      <div className="topbar">
        <button className="back" onClick={onBack} aria-label="뒤로가기">
          ‹
        </button>
        <div className="topbar-title">기록 상세</div>
      </div>

      {status === 'loading' && <div className="loading-text">불러오는 중…</div>}
      {status === 'error' && (
        <div className="error-text">기록을 불러오지 못했어요.</div>
      )}

      {status === 'ready' && entry && (
        <>
          <div className="eyebrow">
            {new Date(entry.createdAt).toLocaleString('ko-KR', {
              timeZone: 'Asia/Seoul',
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
          <div className="original">"{entry.content}"</div>

          {entry.analysis ? (
            <>
              <div className="card">
                <div className="k">
                  <span className="dot" />
                  관찰
                </div>
                <div className="v">{entry.analysis.observation}</div>
              </div>
              <div className="card">
                <div className="k">
                  <span className="dot" />
                  감정
                </div>
                <div className="v">{entry.analysis.emotion}</div>
              </div>
              <div className="card">
                <div className="k">
                  <span className="dot" />
                  행동
                </div>
                <div className="v">{entry.analysis.behavior}</div>
              </div>
              <div className="card hyp-card">
                <div className="k">
                  <span className="dot amber" />
                  가설
                </div>
                <div className="v">{entry.analysis.hypothesis}</div>
              </div>
              <div className="card evidence-card">
                <div className="k">
                  <span className="dot sage" />
                  근거 수준
                </div>
                <div className="v">{entry.analysis.evidenceLevel.label}</div>
                <div className="meter">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <span
                      key={n}
                      className={
                        n <= entry.analysis.evidenceLevel.score ? 'fill' : ''
                      }
                    />
                  ))}
                </div>
              </div>
              <div className="nextexp">
                <div className="k">다음 작은 실험</div>
                {entry.analysis.nextExperiment}
              </div>
            </>
          ) : (
            <div className="card evidence-card">
              <div className="k">
                <span className="dot sage" />
                AI 분석
              </div>
              <div className="v">
                {entry.analysisError
                  ? '이전에 분석을 시도했지만 실패했어요.'
                  : '아직 분석되지 않은 기록이에요.'}
              </div>
              {analyzeError && <div className="error-text">{analyzeError}</div>}
              <button
                className="btn btn-primary"
                style={{ marginTop: 12 }}
                onClick={handleAnalyze}
                disabled={analyzing}
              >
                {analyzing ? '분석하는 중…' : '분석하기'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
