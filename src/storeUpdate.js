
import { createStore } from 'redux';

import rootReducer from './reducerUpdate';

function configureStore() {
    return createStore(rootReducer, {
        serviceWorkerInitialized: false,
        serviceWorkerUpdated: false,
        serviceWorkerRegistration: null,
    });
}

export default configureStore;