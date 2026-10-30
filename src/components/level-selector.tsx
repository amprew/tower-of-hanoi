import React from 'react';
import { MAX_LEVEL } from '../actions/game-controls';

type Props = {
  level: number;
  setLevel: (level: number) => void;
};

const LevelSelector = ({ level, setLevel }: Props) => (
  <div className="level-selector">
    <button
      aria-label="Previous level"
      disabled={level <= 1}
      onClick={() => setLevel(level - 1)}
      type="button"
    >
      −
    </button>
    <span className="level-value">{level}</span>
    <button
      aria-label="Next level"
      disabled={level >= MAX_LEVEL}
      onClick={() => setLevel(level + 1)}
      type="button"
    >
      +
    </button>
  </div>
);

export default React.memo(LevelSelector);
