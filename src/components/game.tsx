import React, { useState, useCallback } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import CurrentItem from './current-item';
import Col from './col';
import MoveCount from './move-count';

import { setSelectedColumn } from '../actions/select-item';
import { resetGame } from '../actions/game-controls';

const Game = ({
  board,
  currentSelected,
  setSelectedColumn,
  isAnimating,
  moveCount,
  resetGame
}) => {
  const [hoverOverride, setHoverOverride] = useState(null);
  const handleMouseOver = (index) => {
    if(isAnimating) return;
    setHoverOverride(index)
  }

  const gameWon = board[board.length-1].length === 4;

  return (
    <div>
      <div className="intro">
        <h1 className="title">Tower of Hanoi</h1>
        <p>Move disc one at a time, get all discs to other side in order without placing a larger on smaller.</p>

        {gameWon && <h3>You won!</h3>}
      </div>

      <div className="game">
        <div className="game-controls">
          <MoveCount count={moveCount} />
          <button onClick={resetGame} type="button" className="link-button">Restart</button>
        </div>

        <div className="col-wrapper current-item-container">
          <CurrentItem board={board} currentSelected={currentSelected} hoverOverride={hoverOverride} />
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
    </div>
  );
}

const mapStateToProps = (state) => state;
const mapDispatchToProps = dispatch => ({
  setSelectedColumn: bindActionCreators(setSelectedColumn, dispatch),
  resetGame: bindActionCreators(resetGame, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(Game);
