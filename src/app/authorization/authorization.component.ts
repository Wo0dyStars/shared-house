import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthorizationService } from './authorizarion.service';

@Component({
	selector: 'app-authorization',
	templateUrl: './authorization.component.html',
	styleUrls: [ './authorization.component.scss' ]
})
export class AuthorizationComponent implements OnInit {
	display: boolean = false;
	isLoginMode: boolean = true;

	constructor(public authorizationService: AuthorizationService) {}

	ngOnInit(): void {}

	onSubmit(form: NgForm) {
		if (!form.valid) {
			return;
		}

		const email = form.value.email;
		const password = form.value.password;

		if (this.isLoginMode) {
			this.authorizationService.login(email, password);
		} else {
			this.authorizationService.createUser(email, password);
		}

		form.reset();
	}

	ToggleDisplayPassword() {
		this.display = !this.display;
	}

	onSwitchMode() {
		this.isLoginMode = !this.isLoginMode;
	}
}
