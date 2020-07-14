import { NgModule } from '@angular/core';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { EmailValidationDirective } from './email-validation.directive';
import { PasswordMatchDirective } from './password-match.directive';
import { PasswordValidationDirective } from './password-validation.directive';

@NgModule({
	declarations: [
		LoadingSpinnerComponent,
		EmailValidationDirective,
		PasswordMatchDirective,
		PasswordValidationDirective
	],
	exports: [ LoadingSpinnerComponent, EmailValidationDirective, PasswordMatchDirective, PasswordValidationDirective ]
})
export class SharedModule {}
