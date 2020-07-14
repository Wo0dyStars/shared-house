import { NgModule } from '@angular/core';
import { AuthorizationComponent } from './authorization.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

@NgModule({
	declarations: [ AuthorizationComponent ],
	imports: [ CommonModule, FormsModule, SharedModule ],
	exports: [ AuthorizationComponent ]
})
export class AuthorizationModule {}
