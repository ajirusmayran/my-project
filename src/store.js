import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
// import promise from 'redux-promise';

import reducers from './reducers';
import rootReducers from './reducers.js';

const store = applyMiddleware(thunk)(createStore);

export function configureStore() {
  return createStore(rootReducers, {
    serviceWorkerInitialized: false,
    serviceWorkerUpdate: false,
    serviceWorkerRegistration: null
  });
}

export default store(
  reducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);