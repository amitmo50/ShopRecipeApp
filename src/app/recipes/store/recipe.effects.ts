import { HttpClient } from '@angular/common/http';
import { switchMap, map, withLatestFrom } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import * as fromRecipeActions from './recipe.actions';
import * as fromApp from '../../store/app.reducer';
import { Recipe } from '../recipe.model';

@Injectable()

export class RecipeEffects {
    fetchRecipes$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fromRecipeActions.fetchRecipes),
            switchMap(() => {
                return this.http.get<Recipe[]>('https://ng-recipe-shoppinglistbook-default-rtdb.firebaseio.com/recipes.json');
            }),
            map(recipes => {
                return recipes.map(recipe => {
                    return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
                });
            }),
            map(recipes => fromRecipeActions.setRecipes({recipes}))
        )
    );

    storeRecipes$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fromRecipeActions.storeRecipes),
            withLatestFrom(this.store.select('recipes')),
            switchMap(([actionData, recipesState]) => {
                return this.http.put(
                    'https://ng-recipe-shoppinglistbook-default-rtdb.firebaseio.com/recipes.json',
                    recipesState.recipes
                );
            })
        ), {dispatch: false}
    );
    constructor(private actions$: Actions, private http: HttpClient, private store: Store<fromApp.AppState>){}
}
