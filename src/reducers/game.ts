import { SELECT_ITEM_ACTION, ANIMATING_ACTION } from '../actions/select-item';
import { SET_MOVE_COUNT_ACTION } from '../actions/move-count';
import { RESET_GAME_ACTION, SET_LEVEL_ACTION } from '../actions/game-controls';

export const getBlockCount = (level) => {
  return level + 2;
};

const getBoardFromLevel = (level) => {
  return [
    Array.from({ length: getBlockCount(level) }, (_, i) => i+1),
    [],
    []
  ];
};

const initialState = {
  board: getBoardFromLevel(1),
  currentSelected: null,
  isAnimating: false,
  moveCount: 0,
  level: 1
};

const getInitialState = () => {
  const newState = {...initialState};
  newState.board = newState.board.map(a => [...a]);
  return newState;
};

// order of cols or pegs in game
// each col is a stack so smallest will always be at the top of stack.
type Board = number[][];
type CurrentSelected = number | null; // infer exact block from the column selected

type State = {
  board: Board;
  currentSelected: CurrentSelected;
  isAnimating: boolean;
  moveCount: number;
  level: number;
};

const resetSelection = (state: State) => {
  return { ...state, currentSelected: null };
};

const moveBlock = (state: State, item: CurrentSelected) => {
  const {
    board,
    currentSelected
  } = state;

  const newBoard = board.slice(0);
  const oldSelected = newBoard[currentSelected].shift();
  newBoard[item] = [oldSelected, ...newBoard[item]];
  return {
    ...state,
    board: newBoard,
    currentSelected: null
  };
};

const setNewSelection = (state: State, item: CurrentSelected ) => {
  const {
    board,
    currentSelected
  } = state;

  if(currentSelected !== null) {
    const currentSelectedSize = board[currentSelected][0];
    if(currentSelectedSize > board[item][0]) return resetSelection(state);

    return moveBlock(state, item);
  }

  return { ...state, currentSelected: item };
};

const setIsAnimating = (state, value) => {
  return { ...state, isAnimating: value };
};

const setMoveCount = (state, value) => {
  return { ...state, moveCount: value };
};

const resetGame = (level = 1) => {
  return {
    ...getInitialState(),
    level,
    board: getBoardFromLevel(level)
  };
};

const setLevel = (level) => {
  const newState = { ...resetGame(), level };
  newState.board = getBoardFromLevel(level);
  return newState;
};

export default function game(state: State = getInitialState(), action = null) {
  switch(action.type) {
    case SELECT_ITEM_ACTION:
      return setNewSelection(state, action.value);
    case ANIMATING_ACTION:
      return setIsAnimating(state, action.value);
    case SET_MOVE_COUNT_ACTION:
      return setMoveCount(state, action.value);
    case RESET_GAME_ACTION:
      return resetGame(state.level);
    case SET_LEVEL_ACTION:
      return setLevel(action.value);
  }

  return state;
}
