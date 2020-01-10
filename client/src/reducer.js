export default function reducer(state, action) {
  switch (action.type) {
    case "LOGIN_USER":
      return {
        ...state,
        currentUser: action.payload
      };

    case "IS_LOGGED_IN":
      return {
        ...state,
        isAuth: action.payload
      };

    case "LOGOUT_USER":
      return {
        ...state,
        isAuth: false,
        currentUser: null
      };

    case "CREATE_DRAFT":
      return {
        ...state,
        draft: {
          latitude: 0,
          longitude: 0
        },
        currentPin: null
      };
    case "UPDATE_DRAFT_LOCATION":
      return {
        ...state,
        draft: action.payload
      };

    case "DELETE_DRAFT":
      return {
        ...state,
        draft: null
      };

    case "GET_PINS":
      return {
        ...state,
        pins: action.payload
      };

    case "CREATE_PIN":
      //get new pin to show on the map along with previous pins
      const newPin = action.payload;
      const prevPins = state.pins.filter(pin => pin._id !== newPin._id);
      return {
        ...state,
        pins: [...prevPins, newPin]
      };

    case "SHOW_PIN_INFO":
      return {
        ...state,
        currentPin: action.payload,
        draft: null
      };

    case "DELETE_PIN":
      const deletedPin = action.payload;
      const filteredPins = state.pins.filter(pin => pin._id !== deletedPin._id);
      return {
        ...state,
        pins: filteredPins,
        currentPin: null
      };

    case "CREATE_COMMENT":
      const updatedCurrentPin = action.payload;

      const updatedPins = state.pins.map(pin =>
        pin._id === updatedCurrentPin._id ? updatedCurrentPin : pin
      );
      return {
        ...state,
        pins: updatedPins,
        //show pin data immidiately on the screen
        currentPin: updatedCurrentPin
      };

    default:
      return state;
  }
}
