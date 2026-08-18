export default function Main({ onWrite, onList }) {
  return (
    <div className="screen">
      <div className="eyebrow">MeLog · Self-observation log</div>
      <h1 className="title">오늘은 어땠나요.</h1>
      <p className="tagline">
        경험을 기록하면, 반복되는 패턴에서 나에 대한 가설을 찾아드려요.
      </p>
      <button className="btn btn-primary" onClick={onWrite}>
        새로운 기록 작성 <span className="btn-arrow">→</span>
      </button>
      <button className="btn btn-secondary" onClick={onList}>
        지난 기록 보기 <span className="btn-arrow">→</span>
      </button>
    </div>
  );
}
