export const SELECT_ITEM_ACTION = 'select-item';

export const setSelectedColumn = (dispatch) => (itemN) => {
  dispatch({
    type: SELECT_ITEM_ACTION,
    value: itemN
  });
};
