import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthorizationComponent } from './authorization/authorization.component';
import { PasswordValidationDirective } from './authorization/password-validation.directive';
import { PasswordMatchDirective } from './authorization/password-match.directive';

@NgModule({
	declarations: [
		AppComponent,
		HeaderComponent,
		AuthorizationComponent,
		PasswordValidationDirective,
		PasswordMatchDirective
	],
	imports: [ BrowserModule, FormsModule, AppRoutingModule ],
	providers: [],
	bootstrap: [ AppComponent ]
})
export class AppModule {}
