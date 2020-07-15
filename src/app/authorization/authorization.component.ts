import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthorizationService } from './authorization.service';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-authorization',
	templateUrl: './authorization.component.html',
	styleUrls: [ './authorization.component.scss' ]
})
export class AuthorizationComponent implements OnInit, OnDestroy {
	display: boolean = false;
	isLoginMode: boolean = true;
	isVerified: boolean = false;
	verificationListener: Subscription;
	message: string = '';
	errorMessage: string = '';
	messageListener: Subscription;
	errorMessageListener: Subscription;

	constructor(public authorizationService: AuthorizationService) {}

	ngOnInit(): void {
		this.verificationListener = this.authorizationService.getIsVerified().subscribe((isVerified) => {
			this.isVerified = isVerified;
		});

		this.messageListener = this.authorizationService.getMessage().subscribe((message) => {
			this.message = message;
		});

		this.errorMessageListener = this.authorizationService.getErrorMessage().subscribe((message) => {
			this.errorMessage = message;
		});

		const currentURL = window.location.href;
		if (currentURL.indexOf('confirmation') !== -1) {
			this.authorizationService.confirmEmail(currentURL.slice(currentURL.indexOf('confirmation') - 1));
		}
	}

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

	ngOnDestroy() {
		this.verificationListener.unsubscribe();
		this.messageListener.unsubscribe();
		this.errorMessageListener.unsubscribe();
	}
}
