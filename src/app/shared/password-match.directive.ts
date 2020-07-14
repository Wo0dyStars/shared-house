import { Validator, NG_VALIDATORS, FormGroup, ValidationErrors } from '@angular/forms';
import { Directive, Input } from '@angular/core';
import { ValidationService } from '../authorization/validation.service';

@Directive({
	selector: '[appPasswordMatch]',
	providers: [
		{
			provide: NG_VALIDATORS,
			useExisting: PasswordMatchDirective,
			multi: true
		}
	]
})
export class PasswordMatchDirective implements Validator {
	@Input('appPasswordMatch') MatchPassword: string[] = [];

	constructor(private validationService: ValidationService) {}

	validate(formGroup: FormGroup): ValidationErrors {
		return this.validationService.MatchPassword(this.MatchPassword[0], this.MatchPassword[1])(formGroup);
	}
}
