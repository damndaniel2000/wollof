import { combineReducers } from "redux";

import trackingReducer from "./reducers/tracking";

const rootReducer = combineReducers({
  trackingReducer,
});

export default rootReducer;
