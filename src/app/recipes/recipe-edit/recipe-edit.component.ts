import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import * as fromApp from '../../store/app.reducer';
import * as fromRecipeAction from '../store/recipe.actions';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit, OnDestroy {
  id!: number;
  editMode = false;
  recipeForm!: FormGroup;
  private storeSub: Subscription;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>
    ) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params.id;
        this.editMode = params.id != null;
        this.initForm();
      }
    );
  }

  private initForm(): void {
    let recipeImage = '';
    let recipeName = '';
    let recipeDescription = '';
    const recipeIngredient = new FormArray([]);
    if (this.editMode) {
      this.storeSub = this.store.select('recipes').pipe(map(recipesState => {
        return recipesState.recipes.find((recipe, index) => {
          return index === this.id;
        });
      })).subscribe(recipe => {
          recipeName = recipe.name;
          recipeDescription = recipe.description;
          recipeImage = recipe.imagePath;
          // tslint:disable-next-line: no-string-literal
          if (recipe['ingredients']){
            for (const ingredient of recipe.ingredients) {
              recipeIngredient.push(
                new FormGroup({
                  name: new FormControl(ingredient.name, Validators.required),
                  amount: new FormControl(ingredient.amount, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
                })
              );
            }
          }
        }
      );
    }
    this.recipeForm = new FormGroup({
      name: new FormControl(recipeName, Validators.required),
      imagePath: new FormControl(recipeImage, Validators.required),
      description: new FormControl(recipeDescription, Validators.required),
      ingredients: recipeIngredient
    });
  }

  // tslint:disable-next-line: typedef
  get Controls() {
    return (this.recipeForm.get('ingredients') as FormArray).controls;
  }

  onSubmit(): void{
    if (this.editMode){
      this.store.dispatch(
        fromRecipeAction.updateRecipe({
          newRecipe: this.recipeForm.value, index: this.id
        }));
    }else{
      this.store.dispatch(
        fromRecipeAction.addRecipe({
          recipe: this.recipeForm.value
        }));
    }
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  onCancel(): void {
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  onAddIngredient(): void{
    (this.recipeForm.get('ingredients') as FormArray).push(
      new FormGroup({
        name: new FormControl(null, Validators.required),
        amount: new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)]),
      })
    );
  }

  onDeleteIngredient(index: number): void{
    (this.recipeForm.get('ingredients') as FormArray).removeAt(index);
  }

  ngOnDestroy(): void{
    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
  }
}
