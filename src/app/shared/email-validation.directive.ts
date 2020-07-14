import { Validator, NG_ASYNC_VALIDATORS, AbstractControl } from '@angular/forms';
import { Directive, forwardRef } from '@angular/core';
import { ValidationService } from '../authorization/validation.service';
import { Observable } from 'rxjs';

@Directive({
	selector: '[appEmailValidation]',
	providers: [
		{
			provide: NG_ASYNC_VALIDATORS,
			useExisting: forwardRef(() => EmailValidationDirective),
			multi: true
		}
	]
})
export class EmailValidationDirective implements Validator {
	constructor(private validationService: ValidationService) {}

	validate(control: AbstractControl): Promise<{ [key: string]: any }> | Observable<{ [key: string]: any }> {
		if (!(control.parent.value.confirmPassword === undefined)) {
			return this.validationService.emailValidator(control);
		}

		return new Promise((resolve) => resolve(null));
	}
}
