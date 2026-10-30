import React from 'react';

type Props = {
  count: number;
  blockCount: number;
};

const MoveCount = ({ count, blockCount }: Props) => {
  const minimumMoves = (2 ** blockCount) - 1;
  const progress = Math.min(100, (count / minimumMoves) * 100);

  return (
    <section className="math-panel" aria-labelledby="math-panel-title">
      <div className="math-panel-heading">
        <div>
          <h2 id="math-panel-title">Moves</h2>
        </div>
        <span className="disc-count">{blockCount} discs</span>
      </div>

      <div className="move-comparison">
        <div className="move-stat">
          <span className="move-stat-label">So far</span>
          <strong>{count.toLocaleString()}</strong>
        </div>
        <span className="comparison-mark" aria-hidden="true">/</span>
        <div className="move-stat">
          <span className="move-stat-label">Minimum</span>
          <strong>{minimumMoves.toLocaleString()}</strong>
        </div>
      </div>

      <div
        className="move-progress"
        role="progressbar"
        aria-label="Progress toward the minimum number of moves"
        aria-valuemin={0}
        aria-valuemax={minimumMoves}
        aria-valuenow={Math.min(count, minimumMoves)}
      >
        <span style={{ width: `${progress}%` }} />
      </div>

      <div className="recurrence">
        <strong>M(n) = 2M(n − 1) + 1</strong>
        <span>
          For {blockCount} discs, 2<sup>{blockCount}</sup> − 1 = {minimumMoves.toLocaleString()}.
        </span>
      </div>

      <details className="math-explanation">
        <summary>How does the pattern work?</summary>
        <p>
          First move the smaller discs aside, then move the largest disc, then move
          the smaller discs back on top. That is two solutions for {blockCount - 1}
          discs, plus one move: M(n) = 2M(n − 1) + 1.
        </p>
      </details>
    </section>
  );
};

export default React.memo(MoveCount);
