import { createStore } from 'redux';
import rootReducers from './reducers.js';


function configureStore() {
    return createStore(rootReducers, {
        serviceWorkerInitialized: false,
        serviceWorkerUpdate: false,
        serviceWorkerRegistration: null
    });
}

export default configureStore;