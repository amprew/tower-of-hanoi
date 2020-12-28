export const RESET_GAME_ACTION = 'reset-game';

export const resetGame = () => {
  return (dispatch) => {
    dispatch({
      type: RESET_GAME_ACTION
    })
  }
}
