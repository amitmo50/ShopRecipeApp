import { createAction, props } from '@ngrx/store';
import { Recipe } from '../recipe.model';


export const setRecipes = createAction(
    '[Recipe] Set Recipe',
    props<{
        recipes: Recipe[]
    }>()
);

export const fetchRecipes = createAction(
    '[Recipe] Fetch Recipes'
);

export const addRecipe = createAction(
    '[Recipe] Add Recipe',
    props<{
        recipe: Recipe
    }>()
);

export const updateRecipe = createAction(
    '[Recipe] Update Recipe',
    props<{
        newRecipe: Recipe,
        index: number
    }>()
);

export const deleteRecipe = createAction(
    '[Recipe] Delete Recipe',
    props<{
        index: number
    }>()
);

export const storeRecipes = createAction(
    '[Recipe] Store Recipe'
);
