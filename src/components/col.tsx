import React from 'react';

import Block from './block';

type Props = {
  items: number[],
  currentSelected: number,
  setSelectedColumn: Function,
  index: number
}

const Col = ({ items, currentSelected, setSelectedColumn, index }: Props) => {
  return (
    <div className="col block-group" onClick={() => setSelectedColumn(index)}>
      <div className="justify-bottom">
        {
          items
            .slice(currentSelected === index ? 1 : 0)
            .map((item) => <Block size={item} key={item} />)
        }
      </div>
    </div>
  );
};

export default Col;
