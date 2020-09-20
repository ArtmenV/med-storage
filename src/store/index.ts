import { applyMiddleware, createStore, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer, { TRootState } from './root-reducer';

const configureStore = (preloadedState?: TRootState): any => {
    const middlewares = [thunkMiddleware];
    const middlewareEnhancer = applyMiddleware(...middlewares);
    const enhancers = [middlewareEnhancer];
    const composedEnhancers = process.env.NODE_ENV === 'development'
        ? composeWithDevTools(...enhancers)
        : compose(...enhancers);
    // @ts-ignore
    const store = createStore(rootReducer, preloadedState, composedEnhancers);

    if (process.env.NODE_ENV === 'development' && module.hot) {
        module.hot.accept('./root-reducer', () => store.replaceReducer(rootReducer));
    }

    return store;
};

export default configureStore;
