import React from 'react';

import Block from './block';

const CurrentItem = ({ board, currentSelected, hoverOverride, blockCount }) => {
  if(currentSelected === null) {
    return null;
  }

  const currentSelectedSize = board[currentSelected][0];

  const game: HTMLElement = document.querySelector('.game');
  const gameWidth = game.offsetWidth / 3;

  return (
    <div className="col col-short col-active" style={{ left: hoverOverride !== null ? gameWidth*hoverOverride : gameWidth*currentSelected }}>
      <Block size={currentSelectedSize} blockCount={blockCount} active={true} />
    </div>
  );
};

export default CurrentItem;
