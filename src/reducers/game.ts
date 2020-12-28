import { SELECT_ITEM_ACTION, ANIMATING_ACTION } from '../actions/select-item';

const initialState = {
  board: [
    [1,2,3,4],
    [],
    []
  ],
  currentSelected: null,
  isAnimating: false
};

// order of cols or pegs in game
// each col is a stack so smallest will always be at the top of stack.
type Board = number[][];
type CurrentSelected = number | null; // infer exact block from the column selected

type State = {
  board: Board;
  currentSelected: CurrentSelected;
  isAnimating: boolean;
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

  if(board[item].length === 0 && currentSelected === null) return state;

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

export default function game(state: State = initialState, action = null) {
  switch(action.type) {
    case SELECT_ITEM_ACTION:
      return setNewSelection(state, action.value);
    case ANIMATING_ACTION:
      return setIsAnimating(state, action.value);
  }

  return state;
}
