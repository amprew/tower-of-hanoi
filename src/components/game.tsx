import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import CurrentItem from './current-item';
import Col from './col';
import MoveCount from './move-count';
import { animateBlockDown, animateBlockUp } from './col';

import { setSelectedColumn as setSelectedColumnAction } from '../actions/select-item';
import {
  resetGame as resetGameAction,
  setLevel as setLevelAction,
} from '../actions/game-controls';
import LevelSelector from './level-selector';

import { getBlockCount } from '../reducers/game';

const getHanoiMoves = (blockCount: number): [number, number][] => {
  const moves: [number, number][] = [];
  const moveStack = (count: number, from: number, to: number, spare: number) => {
    if(count === 0) return;
    moveStack(count - 1, from, spare, to);
    moves.push([from, to]);
    moveStack(count - 1, spare, to, from);
  };

  moveStack(blockCount, 0, 2, 1);
  return moves;
};

const wait = (duration: number) => new Promise<void>(resolve => setTimeout(resolve, duration));

const Game = ({
  board,
  currentSelected,
  setSelectedColumn,
  isAnimating,
  moveCount,
  resetGame,
  level,
  setLevel
}) => {
  const [hoverOverride, setHoverOverride] = useState(null);
  const [isAutoplaying, setIsAutoplaying] = useState(false);
  const handleMouseOver = (index) => {
    if(isAnimating || isAutoplaying) return;
    setHoverOverride(index)
  }

  const blockCount = getBlockCount(level);
  const boardHeight = Math.max(240, blockCount * 34 + 16);

  const gameWon = board[board.length-1].length >= blockCount;

  useEffect(() => {
    if(!isAutoplaying) return undefined;

    let cancelled = false;
    const moves = getHanoiMoves(blockCount);
    let moveIndex = 0;
    const playNextMove = () => {
      if(cancelled) return;
      if(moveIndex >= moves.length) {
        setIsAutoplaying(false);
        return;
      }

      const [from, to] = moves[moveIndex];
      setHoverOverride(from);
      const columns = document.querySelectorAll<HTMLElement>('.col.block-group');
      let pickAnimation = Promise.resolve();
      const picked = setSelectedColumn(from, () => {
        pickAnimation = animateBlockUp(columns[from])();
        return pickAnimation;
      });
      if(!picked) return;
      pickAnimation.then(() => {
        if(cancelled) return;

        setHoverOverride(to);
        return wait(220).then(() => {
          if(cancelled) return;

          let dropAnimation = Promise.resolve();
          const dropped = setSelectedColumn(to, () => {
            dropAnimation = animateBlockDown(columns[to])();
            return dropAnimation;
          });
          if(!dropped) return;
          return dropAnimation.then(() => {
            if(cancelled) return;
            moveIndex += 1;
            playNextMove();
          });
        });
      });
    };

    setHoverOverride(null);
    playNextMove();
    return () => {
      cancelled = true;
    };
  }, [isAutoplaying, blockCount, setSelectedColumn]);

  const stopAutoplay = () => setIsAutoplaying(false);
  const handleReset = () => {
    stopAutoplay();
    resetGame();
  };
  const handleSetLevel = (newLevel: number) => {
    stopAutoplay();
    setLevel(newLevel);
  };

  return (
    <div>
      <div className="intro">
        <h1 className="title">Tower of Hanoi</h1>
        <p>Move disc one at a time, get all discs to other side in order without placing a larger on smaller.</p>

        {gameWon && <h3>You won! <small>(Try the next level...)</small></h3>}
      </div>

      <div className="game">
        <div className="game-controls">
          <MoveCount count={moveCount} blockCount={blockCount} />
          <LevelSelector level={level} setLevel={handleSetLevel} />
          <button onClick={handleReset} type="button" className="link-button">Restart</button>
          <button
            onClick={() => setIsAutoplaying(!isAutoplaying)}
            type="button"
            className="link-button"
            disabled={gameWon && !isAutoplaying}
          >
            {isAutoplaying ? 'Stop autoplay' : 'Autoplay'}
          </button>
        </div>

        <div className="col-wrapper current-item-container">
          <CurrentItem board={board} currentSelected={currentSelected} hoverOverride={hoverOverride} />
        </div>

        <div className="col-wrapper" style={{ height: boardHeight }}>
          {
            board.map((items, index) => (
              <Col
                items={items}
                currentSelected={currentSelected}
                setSelectedColumn={setSelectedColumn}
                index={index}
                key={index} // being used as order will not chnage
                handleMouseOver={handleMouseOver}
                disabled={isAutoplaying}
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
  setSelectedColumn: bindActionCreators(setSelectedColumnAction, dispatch),
  resetGame: bindActionCreators(resetGameAction, dispatch),
  setLevel: bindActionCreators(setLevelAction, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(Game);
