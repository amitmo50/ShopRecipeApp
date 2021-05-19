import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { map, switchMap, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import { environment } from 'src/environments/environment';
import { AuthResponseData } from '../auth.service';
import * as fromAuthActions from './auth.actions';
import { AuthService } from './../auth.service';
import { User } from '../user.model';


const handleAuthentication = (
    expiresIn: number,
    email: string,
    userId: string,
    token: string
  ) => {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    localStorage.setItem('userData', JSON.stringify(user));
    return fromAuthActions.authenticateSuccess({ email, userId, token, expirationDate, redirect: true });
};

const handleError = (errorRes: HttpErrorResponse) => {
    let errorMessage = 'An unknown error occurred!';
    if(!errorRes.error || !errorRes.error.error) {
        return of(fromAuthActions.authenticateFail({errorMessage}));
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
    return of(fromAuthActions.authenticateFail({errorMessage}));;
}

@Injectable()

export class AuthEffects {
    authLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromAuthActions.loginStart),
      switchMap(action => {
        return this.http
          .post<AuthResponseData>(
            `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${environment.apiKey}`,
            {
              email: action.email,
              password: action.password,
              returnSecureToken: true
            }
          )
          .pipe(
            tap(resData => {
              this.auth.setLogoutTimer(+resData.expiresIn * 1000);
            }),
            map(resData => {
              return handleAuthentication(
                +resData.expiresIn,
                resData.email,
                resData.localId,
                resData.idToken
              );
            }),
            catchError(errorRes => {
              return handleError(errorRes);
            })
          );
      })
    )
  );


  authSignup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromAuthActions.signupStart),
      switchMap(action => {
        return this.http
          .post<AuthResponseData>(
            `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${environment.apiKey}`,
            {
              email: action.email,
              password: action.password,
              returnSecureToken: true
            }
          )
          .pipe(
            tap(resData => {
              this.auth.setLogoutTimer(+resData.expiresIn * 1000);
            }),
            map(resData => {
              return handleAuthentication(
                +resData.expiresIn,
                resData.email,
                resData.localId,
                resData.idToken
              );
            }),
            catchError(errorRes => {
              return handleError(errorRes);
            })
          );
      })
    )
  );

  autoLogin$ = createEffect(() =>
      this.actions$
      .pipe(
        ofType(fromAuthActions.autoLogin),
        map(() => {
            const userData: {
                email: string, 
                id: string, 
                _token: string, 
                _tokenExpiration: string} = JSON.parse(localStorage.getItem('userData'));

            if(!userData) {
                return {type: 'DUMMY'};
            }
    
            const loadedUser = new User(
                userData.email, 
                userData.id, 
                userData._token, 
                new Date(userData._tokenExpiration));

            if(loadedUser.token) {
                const expirationDuration = new Date(userData._tokenExpiration).getTime() - new Date().getTime();
                this.auth.setLogoutTimer(expirationDuration);
                return fromAuthActions.authenticateSuccess({ 
                    email: loadedUser.email, 
                    userId: loadedUser.id, 
                    token: loadedUser.token, 
                    expirationDate: new Date(userData._tokenExpiration),
                    redirect: false
                });
            }
            return { type: 'DUMMY' };
        })
      )
  );

  authRedirect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromAuthActions.authenticateSuccess),
      tap(action =>  action.redirect && this.router.navigate(['/']))
    ), { dispatch: false }
  );

  authLogout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromAuthActions.logout),
      tap(() => {
        this.auth.clearLogoutTimer();
        localStorage.removeItem('userData');
        this.router.navigate(['/auth']);
      })
    ),
    { dispatch: false }
  );
  constructor(private actions$: Actions, private http: HttpClient, private auth: AuthService, private router: Router){}



    
}