export default function Saved({ entry, onMain, onList }) {
  return (
    <div className="screen">
      <div className="eyebrow">저장 완료</div>
      <h1 className="title">기록됐어요.</h1>
      <div className="original">"{entry.content}"</div>
      <div className="card evidence-card">
        <div className="k">
          <span className="dot sage" />
          AI 분석
        </div>
        <div className="v">
          아직 이 기록을 분석하는 단계는 연결되지 않았어요. 원본 기록은 안전하게
          저장되었고, 분석 기능이 붙으면 이 기록도 함께 분석돼요.
        </div>
      </div>
      <button className="btn btn-primary" onClick={onList}>
        지난 기록 보기 <span className="btn-arrow">→</span>
      </button>
      <button className="btn btn-secondary" onClick={onMain}>
        메인으로
      </button>
    </div>
  );
}
