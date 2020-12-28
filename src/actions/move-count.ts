export const SET_MOVE_COUNT_ACTION = 'set-move-count';

export const incrementMoveCounter = () => {
  return (dispatch, getState) => {
    const { moveCount } = getState();

    dispatch({
      type: SET_MOVE_COUNT_ACTION,
      value: moveCount + 1
    })
  }
};

export const resetMoveCounter = () => {
  return (dispatch) => {
    dispatch({
      type: SET_MOVE_COUNT_ACTION,
      value: 0
    })
  }
};
