import React from 'react';
import { connect } from 'react-redux';

import Col from './col';

import { setSelectedColumn } from '../actions/select-item';
import Block from './block';

const CurrentItem = ({ board, currentSelected }) => {
  console.log(currentSelected);
  if(currentSelected === null) {
    return null;
  }

  const currentSelectedSize = board[currentSelected][0];

  return Array(board.length).fill(null).map((_, i) => {
    if(i === currentSelected) {
      return (
        <div className="col">
          <Block size={currentSelectedSize} key={i} />
        </div>
      );
    } else {
      return <div className="col"></div>
    }
  })
};

const Game = ({ board, currentSelected, setSelectedColumn }) => {
  // currentSelected, setSelectedColumn
  return (
    <div className="game">
      <div className="col-wrapper current-item-container">
        <CurrentItem board={board} currentSelected={currentSelected} />
      </div>

      <div className="col-wrapper">
        {
          board.map((items, index) => (
            <Col
              items={items}
              currentSelected={currentSelected}
              setSelectedColumn={setSelectedColumn}
              index={index}
              key={index} //being used as order will not chnage
            />
          ))
        }
      </div>
    </div>
  );
}

const mapStateToProps = (state) => state;
const mapDispatchToProps = dispatch => ({
  setSelectedColumn: setSelectedColumn(dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(Game);
