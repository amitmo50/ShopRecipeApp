import { Ingredient } from './../../shared/ingredient.model';
import { createAction, props } from '@ngrx/store';

export const addIngredient = createAction(
    '[Shopping List] ADD_INGREDIENT',
    props<{
        ingredient: Ingredient
    }>()
);

export const addIngredients = createAction(
    '[Shopping List] ADD_INGREDIENTS',
    props<{
        ingredients: Ingredient[]
    }>()
);

export const updateIngredient = createAction(
    '[Shopping List] UPDATE_INGREDIENT',
    props<{
       ingredient: Ingredient 
    }>()
);

export const deleteIngredient = createAction(
    '[Shopping List] DELETE_INGREDIENT',
);

export const startEdit = createAction(
    '[Shopping List] START_EDIT',
    props<{
        index: number
    }>()
);

export const stopEdit = createAction(
    '[Shopping List] STOP_EDIT',
);