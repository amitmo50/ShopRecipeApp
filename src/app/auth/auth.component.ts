import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';
import { Observable, Subscription } from 'rxjs';
import { AuthResponseData } from './auth.service';
import { AlertComponent } from './../shared/alert/alert.component';
import { PlaceholderDirective } from './../shared/placeholder/placeholder.directive';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode = true;
  isLoading = false;
  componentSub: Subscription;
  @ViewChild(PlaceholderDirective, {static: false}) alertHost: PlaceholderDirective;

  constructor(private auth: AuthService, private router: Router, private conponentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit(): void {
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

    let authObs: Observable<AuthResponseData>;

    this.isLoading = true;
    if(this.isLoginMode) {
      authObs = this.auth.login(email, password);
    }else {
      authObs = this.auth.signUp(email, password);
    }

    authObs.subscribe(resData => {
      this.isLoading = false;
      this.router.navigate(['/recipes']);
    }, errorMessage => {
      console.log(errorMessage)
      this.showErrorAlert(errorMessage)
      this.isLoading = false;
    });
    form.reset();
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

  ngOnDestroy() {
    if(this.componentSub) {
      this.componentSub.unsubscribe();
    }
  }
}
