import React from 'react';

type Props = {
  size: number;
  active: boolean;
}

const Block = ({ size, active = false }: Props) => {
  return <div className={`block block-${size} ${active ? 'active-block' : ''}`}></div>
};

export default React.memo(Block);
