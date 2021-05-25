import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Ingredient } from './../../shared/ingredient.model';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as ShoppingListActions from '../store/shopping-list.actions';
import * as fromApp from '../../store/app.reducer';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f') slForm!: NgForm;
  subscription!: Subscription;
  editMode = false;
  editedItemIndex!: number;
  editedItem!: Ingredient;

  constructor(
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit(): void {
    this.subscription = this.store
    .select('shoppingList')
    .subscribe(stateData => {
      if (stateData.editedIndex > -1) {
        this.editMode = true;
        this.editedItem = stateData.editedIngredient;
        this.editedItemIndex = stateData.editedIndex;
        this.slForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        });
      } else {
        this.editMode = false;
      }
    });
  }

  onAddItem(form: NgForm): void {
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    if (this.editMode){
      this.store.dispatch(ShoppingListActions.updateIngredient({ingredient: newIngredient}));
    }else{
      this.store.dispatch(ShoppingListActions.addIngredient({ingredient: newIngredient}));
    }
    this.editMode = false;
    this.store.dispatch(ShoppingListActions.stopEdit());
    form.reset();
  }

  onClear(): void {
    this.editMode = false;
    this.slForm.reset();
    this.store.dispatch(ShoppingListActions.stopEdit());
  }

  onDelete(): void{
    this.store.dispatch(
      ShoppingListActions.deleteIngredient()
    );
    this.onClear();
  }

  ngOnDestroy(): void{
    this.subscription.unsubscribe();
    this.store.dispatch(ShoppingListActions.stopEdit());
  }

}
