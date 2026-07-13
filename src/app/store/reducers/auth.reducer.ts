import { createReducer, on } from '@ngrx/store';
import { loginSuccess } from '../actions/auth.actions';

export interface AuthState {
  isLoggedIn: boolean;
}

export const initialAuthState: AuthState = {
  isLoggedIn: false,
};

export const authReducer = createReducer(
  initialAuthState,
  on(loginSuccess, (state) => ({ ...state, isLoggedIn: true }))
);
