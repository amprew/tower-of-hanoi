import React from 'react';

type Props = {
  count: Number;
};

const MoveCount = ({ count }: Props) => (
  <div>Moves: {count}</div>
);
// append minimum number of moves such as " / min: 7"

export default MoveCount;
