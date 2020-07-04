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
				minlength: minEightChars.test(control.value),
				currentValue: 0,
				currentColor: ''
			};

			const value = () => {
				let level = 0;
				for (let element in strengthLevel) {
					if (element !== 'currentValue' && element !== 'currentColor') {
						level += strengthLevel[element] ? 20 : 0;
					}
				}

				return level;
			};

			strengthLevel.currentValue = value();

			switch (strengthLevel.currentValue) {
				case 20:
					strengthLevel.currentColor = 'bg-danger';
					break;
				case 40:
					strengthLevel.currentColor = 'bg-info';
					break;
				case 60:
					strengthLevel.currentColor = 'bg-default';
					break;
				case 80:
					strengthLevel.currentColor = 'bg-warning';
					break;
				case 100:
					strengthLevel.currentColor = 'bg-success';
			}

			const strong = new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/);
			const isStrong = strong.test(control.value);

			return isStrong ? null : { strength: strengthLevel };
		};
	}
}
