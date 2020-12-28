export const SET_MOVE_COUNT = 'set-move-count';

export const incrementMoveCounter = () => {
  return (dispatch, getState) => {
    const { moveCount } = getState();

    dispatch({
      type: SET_MOVE_COUNT,
      value: moveCount + 1
    })
  }
};

export const resetMoveCounter = () => {
  return (dispatch) => {
    dispatch({
      type: SET_MOVE_COUNT,
      value: 0
    })
  }
};
