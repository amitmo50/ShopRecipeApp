import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from '@angular/router';
import { Store } from "@ngrx/store";

import { environment } from './../../environments/environment';
import { catchError, tap } from 'rxjs/operators';
import { BehaviorSubject, throwError } from 'rxjs';
import { User } from './user.model';
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
    user = new BehaviorSubject<User>(null);
    private tokenExpirationTimer: any;

    constructor(
        private http: HttpClient, 
        private router: Router, 
        private store: Store<fromApp.AppState>){}

    signUp(email: string, password: string) {
        return this.http
            .post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.apiKey}`, 
            {
                email,
                password,
                returnSecureToken: true
            })
            .pipe(catchError(this.handleError), tap(resData => {
                this.handleAuthentication(resData.email, resData.idToken, +resData.expiresIn, resData.localId)
            }));
    }

    logout() {
        this.store.dispatch(new AuthActions.Logout());
        localStorage.removeItem('userData');
        this.router.navigate(['/auth']);

        if(this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
    }

    autoLogout(expirationDuration: number) {
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, expirationDuration);
    }

    autoLogin() {
        const userData: {email: string, id: string, _token: string, _tokenExpiration: string} = JSON.parse(localStorage.getItem('userData'));
        if(!userData) {
            return;
        }

        const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpiration));

        if(loadedUser.token) {
            this.store.dispatch(new AuthActions.Login({ email: loadedUser.email, userId: loadedUser.id, token: loadedUser.token, expirationDate: new Date(userData._tokenExpiration) }));
            const expirationDuration = new Date(userData._tokenExpiration).getTime() - new Date().getTime();

            this.autoLogout(expirationDuration);
        }
    }

    login(email: string, password: string) {
        return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`,
        {
            email,
            password,
            returnSecureToken: true
        })
        .pipe(catchError(this.handleError), tap(resData => {
            this.handleAuthentication(resData.email, resData.idToken, +resData.expiresIn, resData.localId)
        }));
    }
    
    private handleAuthentication(email: string, token: string, expiresIn: number, localId: string) {
        const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
        const user = new User(email, localId, token, expirationDate);
        this.store.dispatch(new AuthActions.Login({email: email, userId: localId, token: token, expirationDate: expirationDate}));
        this.autoLogout(expiresIn * 1000);
        localStorage.setItem('userData', JSON.stringify(user));
    }

    private handleError(errorRes: HttpErrorResponse) {
        let errorMessage = 'An unknown error occurred!';
        if(!errorRes.error || !errorRes.error.error) {
            return throwError(errorMessage)
        }
        switch(errorRes.error.error.message){
            case 'EMAIL_NOT_FOUND':
              errorMessage = 'There is no user record corresponding to this identifier. The user may have been deleted';
              break;
            case 'INVALID_PASSWORD':
              errorMessage = 'The password is invalid';
              break;
            case 'USER_DISABLED':
              errorMessage = 'The user account has been disabled by an administrator';
              break;
            case 'EMAIL_EXISTS':
                errorMessage = 'This Email Exist Already';
                break;
            case 'OPERATION_NOT_ALLOWED':
                errorMessage = 'Password sign-in is disabled for this project';
                break;
            case 'TOO_MANY_ATTEMPTS_TRY_LATER':
                errorMessage = 'We have blocked all requests from this device due to unusual activity. Try again later.';
                break;
        }
        return throwError(errorMessage);
    }
}