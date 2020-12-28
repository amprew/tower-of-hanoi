import React, { useState, useCallback } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Block from './block';
import Col from './col';
import MoveCount from './move-count';

import { setSelectedColumn } from '../actions/select-item';
import { resetGame } from '../actions/game-controls';

const CurrentItem = ({ board, currentSelected, override }) => {
  if(currentSelected === null) {
    return null;
  }

  const currentSelectedSize = board[currentSelected][0];

  const gameWidth = document.querySelector('.game').offsetWidth / 3;

  return (
    <div className="col col-short col-active" style={{ left: override !== null ? gameWidth*override : gameWidth*currentSelected }}>
      <Block size={currentSelectedSize} active={true} />
    </div>
  );
};

const Game = ({
  board,
  currentSelected,
  setSelectedColumn,
  isAnimating,
  moveCount,
  resetGame
}) => {
  const [override, setOverride] = useState(null);
  const handleMouseOver = (index) => {
    if(isAnimating) return;
    setOverride(index)
  }

  return (
    <div className="game">
      <div className="game-controls">
        <MoveCount count={moveCount} />
        <button onClick={resetGame} type="button" className="link-button">Restart</button>
      </div>

      <div className="col-wrapper current-item-container">
        <CurrentItem board={board} currentSelected={currentSelected} override={override} />
      </div>

      <div className="col-wrapper">
        {
          board.map((items, index) => (
            <Col
              items={items}
              currentSelected={currentSelected}
              setSelectedColumn={setSelectedColumn}
              index={index}
              key={index} //being used as order will not chnage
              handleMouseOver={handleMouseOver}
            />
          ))
        }
      </div>
    </div>
  );
}

const mapStateToProps = (state) => state;
const mapDispatchToProps = dispatch => ({
  setSelectedColumn: bindActionCreators(setSelectedColumn, dispatch),
  resetGame: bindActionCreators(resetGame, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(Game);
