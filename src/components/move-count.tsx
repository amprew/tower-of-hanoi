import React from 'react';

type Props = {
  count: Number;
};

const MoveCount = ({ count }: Props) => (
  <div className="move-counter">Moves: {count}</div>
);
// append minimum number of moves such as " / min: 7"

export default MoveCount;
