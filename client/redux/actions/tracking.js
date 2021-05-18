export const setGeofence = (geofence) => ({
  type: "SET_GEOFENCE",
  payload: geofence,
});
export const setCurrentPosition = (location) => ({
  type: "SET_CURRENT_POSITION",
  payload: geofence,
});

export const setIsTracking = (boolean) => ({
  type: "SET_IS_TRACKING",
  isTracking: boolean,
});
