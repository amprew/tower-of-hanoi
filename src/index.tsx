import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import reducers from './reducers';

import Game from './components/game';

const store = createStore(reducers);

ReactDOM.render((
  <Provider store={store}>
    <Game/>
  </Provider>
), document.querySelector('#root'));

