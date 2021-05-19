import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { AlertComponent } from './../shared/alert/alert.component';
import { PlaceholderDirective } from './../shared/placeholder/placeholder.directive';
import * as fromApp from '../store/app.reducer';
import * as AuthAction from './store/auth.actions';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode = true;
  isLoading = false;
  storeSub: Subscription;
  componentSub: Subscription;
  error: string = null;
  @ViewChild(PlaceholderDirective, {static: false}) alertHost: PlaceholderDirective;

  constructor(
    private conponentFactoryResolver: ComponentFactoryResolver,
    private store: Store<fromApp.AppState>
    ) {}

  ngOnInit(): void {
    this.storeSub = this.store.select('auth').subscribe(authState => {
      this.isLoading = authState.loading;
      this.error = authState.authError;
      if(this.error) {
        this.showErrorAlert(this.error);
      }
    });
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode; 
  }

  onSubmit(form: NgForm) {
    if(!form.value) {
      return
    }
    const email = form.value.email;
    const password = form.value.password;

    if(this.isLoginMode) {
      this.store.dispatch(AuthAction.loginStart({email, password}));
    }else {
      this.store.dispatch(AuthAction.signupStart({email, password}));
    }
    form.reset();
  }

  ngOnDestroy() {
    if(this.componentSub) {
      this.componentSub.unsubscribe();
    }
    this.storeSub.unsubscribe();
  }

  private showErrorAlert(errorMessage: string) {
    const alertCompFactory = this.conponentFactoryResolver.resolveComponentFactory(AlertComponent);
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();

    const componentRef = hostViewContainerRef.createComponent(alertCompFactory);
    componentRef.instance.message = errorMessage;
    this.componentSub = componentRef.instance.close.subscribe(() => {
      this.componentSub.unsubscribe();
      hostViewContainerRef.clear();
    });
  }
}
