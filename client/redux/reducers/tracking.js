const initialState = {
  geofence: [],
  isTracking: false,
  currentLocation: null,
};

const trackingReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_GEOFENCE":
      return {
        ...state,
        geofence: action.payload,
      };
    case "SET_CURRENT_POSITION":
      return {
        ...state,
        currentLocation: action.payload,
      };
    case "SET_IS_TRACKING":
      return {
        ...state,
        isTracking: action.payload,
      };
    default:
      return state;
  }
};

export default trackingReducer;
