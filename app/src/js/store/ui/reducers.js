import {
	SET_UI
} from './actionTypes';

const initialState = {
	bottomHeaderActiverStyles: {},
	bottomHeaderScrollPos: 0
}

export const uiReducer = (state=initialState, action) => {
	switch (action.type) {
		case SET_UI:
			return {
				...state,
				...action.payload
			}
		default: {
			return state;
		}
	}
}