import React from 'react';

type Props = {
  count: Number;
};

const MoveCount = ({ count }: Props) => (
  <div>Moves: {count}</div>
);

export default MoveCount;
