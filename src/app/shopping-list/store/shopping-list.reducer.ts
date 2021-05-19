import { Action, createReducer, on } from '@ngrx/store';
import { Ingredient } from './../../shared/ingredient.model';
import * as ShoppingListActions from './shopping-list.actions';



export interface State {
    ingredients: Ingredient[],
    editedIngredient: Ingredient,
    editedIndex: number
}

const initialState: State = {
    ingredients: [
        new Ingredient("Apples", 5),
        new Ingredient("Tomatoes", 10),
    ],
    editedIngredient: null,
    editedIndex: -1
};

const _shoppingListReducer = createReducer(
    initialState,
    on(
        ShoppingListActions.addIngredient,
        (state, action) => ({
            ...state,
            ingredients: [
                ...state.ingredients,
                action.ingredient
            ]
        })
    ),
    on(
        ShoppingListActions.addIngredients,
        (state, action) => ({
            ...state,
            ingredients: [
                ...state.ingredients,
                ...action.ingredients
            ]
        })
    ),
    on(
        ShoppingListActions.updateIngredient,
        (state, action) => ({
            ...state,
            editedIndex: -1,
            editedIngredient: null,
            ingredients: state.ingredients.map(
                (ingredient, index) => index === state.editedIndex ? {...action.ingredient } : ingredient
            )
        })
    ),
    on(
        ShoppingListActions.deleteIngredient,
        (state) => ({
            ...state,
            ingredients: state.ingredients.filter((ingredeint, index) => {
                return index !== state.editedIndex;
            })
        })
    ),
    on(
        ShoppingListActions.startEdit,
        (state, action) => ({
            ...state,
            editedIndex: action.index,
            editedIngredient: {...state.ingredients[action.index] }
        })  
    ),
    on(
        ShoppingListActions.stopEdit,
        (state) => ({
            ...state,
            editedIndex: -1,
            editedIngredient: null
        })
    )
)

export function shoppingListReducer(state: State, action: Action) {
    return _shoppingListReducer(state, action);
}