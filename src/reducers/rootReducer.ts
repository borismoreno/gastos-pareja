import { combineReducers } from "redux";
import hogarReducer from './hogarSlice';

const rootReducer = combineReducers({
    hogar: hogarReducer
})

export default rootReducer;