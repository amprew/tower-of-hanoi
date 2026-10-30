import React, { useEffect, useRef, useState } from 'react';
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

const getHanoiMove = (
  blockCount: number,
  moveNumber: number,
  diskPositions: number[]
): [number, number] => {
  let diskIndex = 0;
  let remainingMoves = moveNumber;
  while(remainingMoves % 2 === 0) {
    diskIndex += 1;
    remainingMoves /= 2;
  }

  const diskNumber = diskIndex + 1;
  const direction = blockCount % 2 === diskNumber % 2 ? -1 : 1;
  const from = diskPositions[diskIndex];
  const to = (from + direction + 3) % 3;
  diskPositions[diskIndex] = to;
  return [from, to];
};

const wait = (duration: number) => new Promise<void>(resolve => setTimeout(resolve, duration));

const MOVE_ANIMATION_DURATION_MS = 150;
const MOVE_PAUSE_MS = 220;
const MAX_ESTIMATED_MOVE_DURATION_MS = 5000;
const ESTIMATED_SECONDS_PER_MOVE = (
  MOVE_ANIMATION_DURATION_MS * 2 + MOVE_PAUSE_MS
) / 1000;

const formatCountdown = (seconds: number) => {
  const totalSeconds = Math.max(0, Math.ceil(seconds));
  const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
  const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
  const remainingSeconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${hours}:${minutes}:${remainingSeconds}`;
};

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
  const [countdownSeconds, setCountdownSeconds] = useState(0);
  const countdownDeadline = useRef<number | null>(null);
  const handleMouseOver = (index) => {
    if(isAnimating || isAutoplaying) return;
    setHoverOverride(index)
  }

  const blockCount = getBlockCount(level);
  const boardHeight = Math.max(240, blockCount * 34 + 16);

  const gameWon = board[board.length-1].length >= blockCount;

  useEffect(() => {
    if(!isAutoplaying) {
      countdownDeadline.current = null;
      setCountdownSeconds(0);
      return undefined;
    }

    let cancelled = false;
    let moveIndex = 0;
    const diskPositions = Array(blockCount).fill(0);
    const totalMoves = (2 ** blockCount) - 1;
    const recentMoveDurations: number[] = [];
    const startedAt = Date.now();
    let lastEstimateAt = startedAt;
    countdownDeadline.current = startedAt + totalMoves * ESTIMATED_SECONDS_PER_MOVE * 1000;
    setCountdownSeconds(Math.ceil(totalMoves * ESTIMATED_SECONDS_PER_MOVE));

    const countdownTimer = window.setInterval(() => {
      const now = Date.now();
      if(now - lastEstimateAt >= 5000 && recentMoveDurations.length > 0) {
        const averageMoveDuration = recentMoveDurations.reduce(
          (total, duration) => total + duration,
          0
        ) / recentMoveDurations.length;
        const remainingMoves = totalMoves - moveIndex;
        countdownDeadline.current = now + remainingMoves * averageMoveDuration;
        lastEstimateAt = now;
      }

      const deadline = countdownDeadline.current;
      if(deadline !== null) {
        const secondsRemaining = Math.ceil(Math.max(0, deadline - now) / 1000);
        setCountdownSeconds(Math.max(1, secondsRemaining));
      }
    }, 1000);

    const playNextMove = () => {
      if(cancelled) return;
      if(moveIndex >= totalMoves) {
        countdownDeadline.current = Date.now();
        setCountdownSeconds(0);
        setIsAutoplaying(false);
        return;
      }

      const moveStartedAt = Date.now();
      const [from, to] = getHanoiMove(blockCount, moveIndex + 1, diskPositions);
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
        return wait(MOVE_PAUSE_MS).then(() => {
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
            const moveDuration = Date.now() - moveStartedAt;
            if(moveDuration <= MAX_ESTIMATED_MOVE_DURATION_MS) {
              recentMoveDurations.push(moveDuration);
              if(recentMoveDurations.length > 100) recentMoveDurations.shift();
            }
            playNextMove();
          });
        });
      });
    };

    setHoverOverride(null);
    playNextMove();
    return () => {
      cancelled = true;
      window.clearInterval(countdownTimer);
    };
  }, [isAutoplaying, blockCount, setSelectedColumn]);

  const stopAutoplay = () => setIsAutoplaying(false);
  const handleReset = () => {
    stopAutoplay();
    resetGame();
  };
  const handleAutoplayToggle = () => {
    resetGame();
    setIsAutoplaying(!isAutoplaying);
  };
  const handleSetLevel = (newLevel: number) => {
    stopAutoplay();
    setLevel(newLevel);
  };

  return (
    <div className="app-shell">
      <header className="intro">
        <div className="intro-copy">
          <p className="eyebrow">A CLASSIC PUZZLE IN RECURSION</p>
          <h1 className="title">The Tower<br />of Hanoi<span>.</span></h1>
          <p className="intro-description">
            Move one disc at a time. Never place a larger disc on a smaller one.
          </p>
        </div>
        <div className="intro-note">
          <span>The fewest possible moves</span>
          <strong>2<sup>n</sup> − 1</strong>
          <small>Every disc doubles the work.</small>
        </div>
      </header>

      <section className="game" aria-label="Tower of Hanoi game">
        <div className="game-toolbar">
          <div className="level-control">
            <span className="control-label">Level</span>
            <LevelSelector level={level} setLevel={handleSetLevel} />
            <span className="level-caption">{blockCount} discs</span>
          </div>

          <div className="game-actions">
            {(isAutoplaying || gameWon) && (
              <div className="countdown" aria-live="polite">
                <span>{gameWon ? 'Solved in' : 'Estimated time'}</span>
                <time>{formatCountdown(countdownSeconds)}</time>
              </div>
            )}
            <button onClick={handleReset} type="button" className="button button-secondary">
              Reset
            </button>
            <button
              onClick={handleAutoplayToggle}
              type="button"
              className="button button-primary"
              disabled={gameWon && !isAutoplaying}
            >
              {isAutoplaying ? 'Stop autoplay' : 'Solve for me'}
            </button>
          </div>
        </div>

        {gameWon && (
          <p className="win-message" role="status">
            Puzzle solved. Try another level?
          </p>
        )}

        <div className="board-frame">
          <div className="col-wrapper current-item-container">
            <CurrentItem board={board} currentSelected={currentSelected} hoverOverride={hoverOverride} blockCount={blockCount} />
          </div>

          <div className="col-wrapper board" style={{ height: boardHeight }}>
            {
              board.map((items, index) => (
                <Col
                  items={items}
                  blockCount={blockCount}
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

          <div className="peg-labels" aria-hidden="true">
            <span>01</span>
            <span>02</span>
            <span>03</span>
          </div>
        </div>

        <MoveCount count={moveCount} blockCount={blockCount} />
      </section>

      <footer className="page-footer">
        <span>Take your time. Find the pattern.</span>
        <span>Three pegs · {blockCount} discs</span>
      </footer>
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
