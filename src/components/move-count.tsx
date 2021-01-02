import React from 'react';

type Props = {
  count: number;
  blockCount: number;
};

const MoveCount = ({ count, blockCount }: Props) => (
  <div>Moves: {count} (min: {Math.pow(2, blockCount)-1})</div>
);

export default React.memo(MoveCount);
