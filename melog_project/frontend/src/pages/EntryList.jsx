import { useEffect, useState } from 'react';
import { listEntries } from '../api/entries';

export default function EntryList({ onBack, onWrite }) {
  const [entries, setEntries] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | error

  useEffect(() => {
    listEntries()
      .then((data) => {
        setEntries(data.entries);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, []);

  return (
    <div className="screen">
      <div className="topbar">
        <button className="back" onClick={onBack} aria-label="뒤로가기">
          ‹
        </button>
        <div className="topbar-title">지난 기록</div>
      </div>

      {status === 'loading' && <div className="loading-text">불러오는 중…</div>}
      {status === 'error' && (
        <div className="error-text">기록을 불러오지 못했어요.</div>
      )}
      {status === 'ready' && entries.length === 0 && (
        <div className="empty-text">
          아직 기록이 없어요. 첫 기록을 남겨보세요.
        </div>
      )}

      {entries.map((e) => (
        <div className="list-item" key={e.id}>
          <div className="date">
            {new Date(e.createdAt).toLocaleString('ko-KR', {
              timeZone: 'Asia/Seoul',
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
          <div className="snip">{e.snippet}</div>
          {e.mainEmotion && <span className="tag">{e.mainEmotion}</span>}
        </div>
      ))}

      <button className="fab" onClick={onWrite} aria-label="새 기록">
        ＋
      </button>
    </div>
  );
}
