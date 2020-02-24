import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { initializeFirebase } from './push-notification';
import * as serviceWorker from './serviceWorker';
import store from './store';
import { SW_INIT, SW_UPDATE } from './types';

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA

serviceWorker.register({
    onSuccess: () => store.dispatch({ types: SW_INIT }),
    onUpdate: registration => store.dispatch({ SW_UPDATE, payload: registration }),
});
initializeFirebase();