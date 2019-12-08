
import {SET_UI} from './actionTypes';

export const setUIProps = (newProps={}) => {
	return {
		type: SET_UI,
		payload: newProps
	}
}