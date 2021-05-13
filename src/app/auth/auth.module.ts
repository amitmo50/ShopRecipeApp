import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AuthComponent } from './auth.component';
import { LoadingSpinnerComponent } from './../shared/loading-spinner/loading-spinner.component';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';
import { AuthRoutingModule } from './auth-routing.module';


@NgModule({
    declarations: [
        AuthComponent,
        LoadingSpinnerComponent,
        AlertComponent,
        PlaceholderDirective
    ],
    imports:[
        FormsModule,
        CommonModule,
        AuthRoutingModule
    ],
    exports: [
        AuthComponent,
        LoadingSpinnerComponent,
        AlertComponent,
        PlaceholderDirective
    ]
})

export class AuthModule {}