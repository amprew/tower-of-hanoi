import React from 'react';

type Props = {
  level: number;
  setLevel: (level: number) => void;
};

const LevelSelector = ({ level, setLevel }: Props) => (
  <div>
    Level:{' '}
    <button onClick={() => setLevel(level - 1)} type="button">-</button>
    {level}
    <button onClick={() => setLevel(level + 1)} type="button">+</button>
  </div>
);

export default LevelSelector;
