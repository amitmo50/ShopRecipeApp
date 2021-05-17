import { User } from "../user.model";
import * as fromAuthActions from "./auth.actions";

export interface State {
    user: User;
}

const initialState: State = {
    user: null
};

export function AuthReducer(state: State = initialState, action: fromAuthActions.AuthActions) {
    switch(action.type) {
        case 'LOGIN':
            const user = new User(
                action.payload.email, 
                action.payload.userId, 
                action.payload.token, 
                action.payload.expirationDate
            );
            return {
                ...state,
                user
            }
        case 'LOGOUT':
            return {
                ...state,
                user: null
            }
        default:
            return state;
    }
}

