import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthorizationComponent } from './authorization/authorization.component';
import { PasswordValidationDirective } from './authorization/password-validation.directive';
import { PasswordMatchDirective } from './authorization/password-match.directive';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthorizationInterceptor } from './authorization/authorization.interceptor';
import { EmailValidationDirective } from './authorization/email-validation.directive';
import { UsersComponent } from './users/users.component';
import { UserProfileComponent } from './users/user-profile/user-profile.component';
import { ShoppingListComponent } from './users/shopping-list/shopping-list.component';
import { TaskComponent } from './users/task/task.component';

@NgModule({
	declarations: [
		AppComponent,
		HeaderComponent,
		AuthorizationComponent,
		PasswordValidationDirective,
		PasswordMatchDirective,
		EmailValidationDirective,
		UsersComponent,
		UserProfileComponent,
		ShoppingListComponent,
		TaskComponent
	],
	imports: [ BrowserModule, FormsModule, AppRoutingModule, HttpClientModule ],
	providers: [
		{
			provide: HTTP_INTERCEPTORS,
			useClass: AuthorizationInterceptor,
			multi: true
		}
	],
	bootstrap: [ AppComponent ]
})
export class AppModule {}
