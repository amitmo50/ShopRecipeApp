import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

import * as fromApp from '../store/app.reducer';
import * as AuthAction from '../auth/store/auth.actions';
import * as fromRecipeActions from '../recipes/store/recipe.actions';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private userSub!: Subscription;
  isAuthenticated = false;
  isPhoneSize = false;

  constructor(
    private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.userSub = this.store.select('auth')
    .pipe(map(authState => authState.user))
    .subscribe(user => {
      this.isAuthenticated = !user ? false : true;
    });
  }

  onOpenOptions(): void {
    this.isPhoneSize = !this.isPhoneSize;
  }

  onResize(event: any): void {
    if (event.target.innerWidth < 780) {
      this.isPhoneSize = true;
    } else {
      this.isPhoneSize = false;
    }
  }

  onSaveData(): void {
    this.store.dispatch(fromRecipeActions.storeRecipes());
  }

  onFetchData(): void {
    this.store.dispatch(fromRecipeActions.fetchRecipes());
  }

  onLogout(): void {
    this.store.dispatch(AuthAction.logout());
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

}
