import { Map, List, fromJS} from 'immutable'; 
import { push } from 'react-router-redux';

// Reducer Name
const reducerName = 'contentPage';

// Declare Some Variable Here
let someVariable = 'Hello World';

// Initialize Initial State
const initialState = fromJS({
  navIsActive: false
})

// Function to generate action name
const createActionName = (actionName) => `app/${reducerName}/${actionName}`;



// Selectors

// Actions
export const ON_NAVIGATION_TAP = createActionName('ON_NAVIGATION_TAP');
export const ON_NAVIGATION_MENU_TAP = createActionName('ON_NAVIGATION_MENU_TAP');

// Actions Creator
export const onNavigationTap = () => ({ type: ON_NAVIGATION_TAP });
export const onNavigationMenuTap = () => ({ type: ON_NAVIGATION_MENU_TAP });

export const onNavigationMenuTapAction = (url) => {
  return dispatch => {
    dispatch(onNavigationMenuTap());
    dispatch(push(url));
  }
}

export const onLogoutAction = (url) => {
  return dispatch => {
    window.localStorage.removeItem('auth-token');
    dispatch(onNavigationMenuTapAction(url));
  }
}

// Reducer
export default function reducer(state=initialState, action) {
  switch(action.type) {
    case ON_NAVIGATION_MENU_TAP:
      return state.set('navIsActive', false);
    case ON_NAVIGATION_TAP:
      return state.set('navIsActive', !state.get('navIsActive'));
    default:
      return state;
  }
}
