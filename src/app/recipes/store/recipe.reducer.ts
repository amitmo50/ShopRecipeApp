import { Action, createReducer, on } from '@ngrx/store';
import { Recipe } from '../recipe.model';
import * as fromRecipeAction from './recipe.actions';

export interface State {
    recipes: Recipe[];
}

const initialState: State = {
    recipes: [],
};

const recipeReducer = createReducer(
    initialState,
    on(
        fromRecipeAction.setRecipes,
        (state, action) => ({
            ...state,
            recipes: [...action.recipes]
        })
    ),
    on(
        fromRecipeAction.addRecipe,
        (state, action) => ({
            ...state,
            recipes: [...state.recipes, action.recipe]
        })
    ),
    on(
        fromRecipeAction.updateRecipe,
        (state, action) => ({
            ...state,
            recipes: state.recipes.map((recipe, index) => {
                return index === action.index ? {...action.newRecipe} : recipe;
            })
        })
    ),
    on(
        fromRecipeAction.deleteRecipe,
        (state, action) => ({
            ...state,
            recipes: state.recipes.filter((_ , index) => index !== action.index)
        })
    )
);


// tslint:disable-next-line: typedef
export function RecipeReducer(state: State, action: Action) {
    return recipeReducer(state, action);
}
