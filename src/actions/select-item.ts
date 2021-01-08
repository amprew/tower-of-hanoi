export const SELECT_ITEM_ACTION = 'select-item';
export const ANIMATING_ACTION = 'is-animating';

import { incrementMoveCounter } from './move-count';

const dispatchAnimating = (dispatch, isAnimating: boolean) => {
  dispatch({
    type: ANIMATING_ACTION,
    value: isAnimating
  })
};

const dispatchSelectedColumn = (dispatch, itemN: number) => {
  dispatch({
    type: SELECT_ITEM_ACTION,
    value: itemN
  });
};

export const setSelectedColumn = (itemN: number, animation: () => Promise<void>): boolean => {
  return (dispatch, getState) => {
    const {
      board,
      currentSelected
    } = getState();

    // if no item selected & you are trying to pick up from empty column
    if(currentSelected === null && board[itemN].length === 0) return false;
    // if item selected & current selected is greater than top of column
    if(currentSelected !== null && board[currentSelected][0] > board[itemN][0]) return false;

    if(currentSelected !== null && currentSelected !== itemN) {
      dispatch(incrementMoveCounter());
    }
    dispatchAnimating(dispatch, true);

    animation().then(() => {
      dispatchAnimating(dispatch, false);
      dispatchSelectedColumn(dispatch, itemN);
    });
    return true;
  }
};
