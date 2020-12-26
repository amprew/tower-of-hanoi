import { SELECT_ITEM_ACTION } from '../actions/select-item';

const initialState = {
  board: [
    [1,2,3,4,5],
    [],
    []
  ],
  currentSelected: null
};

// order of cols or pegs in game
// each col is a stack so smallest will always be at the top of stack.
type Board = number[][];
type CurrentSelected = number | null; // infer exact block from the column selected

type State = {
  board: Board;
  currentSelected: CurrentSelected;
};

const setNewSelection = (state: State, item: CurrentSelected ) => {
  const {
    board,
    currentSelected
  } = state;

  if(board[item].length === 0 && currentSelected === null) return state;

  // console.log(currentSelected);
  if(currentSelected !== null) {
    const currentSelectedSize = board[currentSelected][0];
    if(currentSelectedSize > board[item][0]) return state;

    console.log(board, currentSelected, item);
    const newBoard = board.slice(0);
    const oldSelected = newBoard[currentSelected].shift();
    newBoard[item] = [oldSelected, ...newBoard[item]];
    return {
      ...state,
      board: newBoard,
      currentSelected: null
    }
  }

  return { ...state, currentSelected: item };
};

export default function game(state: State = initialState, action = null) {
  switch(action.type) {
    case SELECT_ITEM_ACTION:
      return setNewSelection(state, action.value);
  }

  return state;
}
