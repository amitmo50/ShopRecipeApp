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

export function shoppingListReducer(state: State = initialState, action: ShoppingListActions.ShoppingListActions) {

    switch(action.type){
        case ShoppingListActions.ADD_INGREDIENT:
            return {
                ...state,
                ingredients: [
                    ...state.ingredients,
                    action.payload
                ]
            };
        case ShoppingListActions.ADD_INGREDIENTS:
            return {
                ...state,
                ingredients: [
                    ...state.ingredients,
                    ...action.payload
                ]
            };
        case ShoppingListActions.UPDATE_INGREDIENT:
            const ingredient = state.ingredients[state.editedIndex];

            const updatedIngredient = {
                ...ingredient,
                ...action.payload
            }
            const updatedIngredients = [...state.ingredients];
            updatedIngredients[state.editedIndex] = updatedIngredient;
            return {
                ...state,
                ingredients: updatedIngredients
            };
        case ShoppingListActions.DELETE_INGREDIENT:

            return {
                ...state,
                ingredients: state.ingredients.filter((ingredeint, index) => {
                    return index !== state.editedIndex;
                })
            };
        case ShoppingListActions.START_EDIT:
            return{
                ...state,
                editedIndex: action.payload,
                editedIngredient: {...state.ingredients[action.payload] }
            }
        case ShoppingListActions.STOP_EDIT:
            return{
                ...state,
                editedIndex: -1,
                editedIngredient: null
            }
        default:
            return state;
    }
}