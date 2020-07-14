import { Directive } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';
import { ValidationService } from '../authorization/validation.service';

@Directive({
	selector: '[appPasswordValidation]',
	providers: [
		{
			provide: NG_VALIDATORS,
			useExisting: PasswordValidationDirective,
			multi: true
		}
	]
})
export class PasswordValidationDirective implements Validator {
	constructor(private validationService: ValidationService) {}

	validate(control: AbstractControl): { [strength: string]: any } | null {
		return this.validationService.patternValidator()(control);
	}
}
