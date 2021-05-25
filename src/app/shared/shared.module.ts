import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DropdownDirective } from './dropdown.directive';


@NgModule({
    declarations: [
        DropdownDirective,
    ],
    imports: [
        CommonModule
    ],
    exports: [
        DropdownDirective,
        CommonModule
    ]
})

export class SharedModule {}
