import { useState } from 'react';
import { createEntry } from '../api/entries';

export default function Write({ onBack, onSaved }) {
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('idle'); // idle | saving | error
  const [error, setError] = useState('');

  async function handleSubmit() {
    if (!content.trim()) {
      setError('기록 내용을 입력해주세요.');
      return;
    }
    setStatus('saving');
    setError('');
    try {
      const { entry } = await createEntry(content);
      setContent('');
      setStatus('idle');
      onSaved(entry);
    } catch (e) {
      setStatus('error');
      setError(e.message);
    }
  }

  return (
    <div className="screen">
      <div className="topbar">
        <button className="back" onClick={onBack} aria-label="뒤로가기">
          ‹
        </button>
        <div className="topbar-title">기록 작성</div>
      </div>

      <div className="prompt-line">오늘 어떤 일이 있었나요?</div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="정해진 형식은 없어요. 있었던 일을 편하게 적어주세요."
        rows={10}
      />
      {error && <div className="error-text">{error}</div>}

      <button
        className="btn btn-primary"
        onClick={handleSubmit}
        disabled={status === 'saving'}
      >
        {status === 'saving' ? '저장하는 중…' : '기록하기'}
      </button>
    </div>
  );
}
