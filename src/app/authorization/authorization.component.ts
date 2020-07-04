import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
	selector: 'app-authorization',
	templateUrl: './authorization.component.html',
	styleUrls: [ './authorization.component.scss' ]
})
export class AuthorizationComponent implements OnInit {
	display: boolean = false;

	constructor() {}

	ngOnInit(): void {}

	onSubmit(form: NgForm) {
		if (!form.valid) {
			return;
		}

		const email = form.value.email;
		const password = form.value.password;
		console.log(email, password);

		form.reset();
	}

	ToggleDisplayPassword() {
		this.display = !this.display;
	}
}
