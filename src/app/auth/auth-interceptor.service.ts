import { Injectable } from '@angular/core';
import { HttpHandler, HttpInterceptor, HttpRequest, HttpParams } from '@angular/common/http';
import { exhaustMap, take, map } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';

@Injectable({
    providedIn: 'root'
})

export class AuthInterceptorService implements HttpInterceptor{

    constructor(private store: Store<fromApp.AppState>){}

    // tslint:disable-next-line: typedef
    intercept(req: HttpRequest<any>, next: HttpHandler){
        return this.store.select('auth').pipe(
            take(1),
            map(authState => {
                return authState.user;
            }),
            exhaustMap(user => {
                if (!user) {
                    return next.handle(req);
                }
                const modifiedReq = req.clone({params: new HttpParams().set('auth', user.token)});
                return next.handle(modifiedReq);
            })
        );
    }
}
