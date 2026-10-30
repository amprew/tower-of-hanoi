import React from 'react';

type Props = {
  size: number;
  blockCount: number;
  active?: boolean;
}

const Block = ({ size, blockCount, active = false }: Props) => {
  const width = 32 + ((size - 1) * 54) / (blockCount - 1);
  return (
    <div
      className={`block block-${size} ${active ? 'active-block' : ''}`}
      style={{ width: `${width}%` }}
    />
  );
};

export default React.memo(Block);
