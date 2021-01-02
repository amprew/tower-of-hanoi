import React from 'react';

type Props = {
  count: number;
};

const MoveCount = ({ count }: Props) => (
  <div>Moves: {count}</div>
);

export default MoveCount;
