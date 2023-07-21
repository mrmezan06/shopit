import { createStore, combineReducers, applyMiddleware } from 'redux';
// import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import {
  productDetailsReducer,
  productReducer,
} from './reducer/productReducer';

import { authReducer } from './reducer/userReducer';

const reducer = combineReducers({
  products: productReducer,
  productDetails: productDetailsReducer,
  auth: authReducer,
});

const initialState = {};

const middleware = [thunk];
const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
