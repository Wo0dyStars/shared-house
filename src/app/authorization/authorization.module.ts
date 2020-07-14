import { NgModule } from '@angular/core';
import { AuthorizationComponent } from './authorization.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
	declarations: [ AuthorizationComponent ],
	imports: [
		CommonModule,
		FormsModule,
		SharedModule,
		RouterModule.forChild([ { path: '', component: AuthorizationComponent } ])
	],
	exports: [ AuthorizationComponent ]
})
export class AuthorizationModule {}
