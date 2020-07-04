import { Injectable } from '@angular/core';
import { ValidatorFn, AbstractControl } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class ValidationService {
	patternValidator(): ValidatorFn {
		return (control: AbstractControl): { [strength: string]: any } => {
			if (!control.value) {
				return null;
			}

			const oneLowercaseChar = new RegExp(/^(?=.*?[a-z])/);
			const oneUppercaseChar = new RegExp(/^(?=.*?[A-Z])/);
			const oneDigitChar = new RegExp(/^(?=.*?[0-9])/);
			const oneSpecialChar = new RegExp(/^(?=.*?[" !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~"])/);
			const minEightChars = new RegExp(/^.{8,}$/);

			const strengthLevel = {
				lowercase: oneLowercaseChar.test(control.value),
				uppercase: oneUppercaseChar.test(control.value),
				digit: oneDigitChar.test(control.value),
				special: oneSpecialChar.test(control.value),
				minlength: minEightChars.test(control.value)
			};

			const strong = new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/);
			const isStrong = strong.test(control.value);

			return isStrong ? null : { strength: strengthLevel };
		};
	}
}
