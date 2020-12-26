import React from 'react';

type Props = {
  size: number;
}

const Block = ({ size }: Props) => {
  return <div className={`block block-${size}`}></div>
};

export default Block;
