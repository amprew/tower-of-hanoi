export const RESET_GAME_ACTION = 'reset-game';
export const SET_LEVEL_ACTION = 'set-level';

export const resetGame = () => {
  return (dispatch) => {
    dispatch({
      type: RESET_GAME_ACTION
    })
  }
};

export const setLevel = (levelNumber: number) => {
  return (dispatch) => {
    if(levelNumber < 1 || levelNumber > 4) return;
    dispatch({
      type: SET_LEVEL_ACTION,
      value: levelNumber
    })
  }
};
