import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

export interface AuthResponseData {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    private tokenExpirationTimer: any;

    constructor(private store: Store<fromApp.AppState>){}

    setLogoutTimer(expirationDuration: number): void{
        this.tokenExpirationTimer = setTimeout(() => {
          this.store.dispatch(AuthActions.logout());
        }, expirationDuration);
    }

    clearLogoutTimer(): void {
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
            this.tokenExpirationTimer = null;
        }
    }
}
