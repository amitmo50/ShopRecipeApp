import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { take, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { Recipe } from './recipe.model';
import * as fromApp from '../store/app.reducer';
import * as fromRecipeAction from '../recipes/store/recipe.actions';


@Injectable({
    providedIn:'root'
})
export class RecipesResolverService implements Resolve<{recipes: Recipe[]}>{
    constructor(
        private store: Store<fromApp.AppState>,
        private actions$: Actions
        ){}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.store.select('recipes').pipe(
            take(1),
            map(recipeState => recipeState.recipes),
            switchMap(recipes => {
                if(recipes.length === 0) {
                    this.store.dispatch(fromRecipeAction.fetchRecipes());
                    return this.actions$.pipe(
                        ofType(fromRecipeAction.setRecipes),
                        take(1)
                    )
                }else {
                    return of({recipes});
                }
            })
        );
    }
}