import React from 'react';

import Block from './block';

const CurrentItem = ({ board, currentSelected, hoverOverride }) => {
  if(currentSelected === null) {
    return null;
  }

  const currentSelectedSize = board[currentSelected][0];

  const gameWidth = document.querySelector('.game').offsetWidth / 3;

  return (
    <div className="col col-short col-active" style={{ left: hoverOverride !== null ? gameWidth*hoverOverride : gameWidth*currentSelected }}>
      <Block size={currentSelectedSize} active={true} />
    </div>
  );
};

export default CurrentItem;
