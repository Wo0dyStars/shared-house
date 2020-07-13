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
	messageListener: Subscription;

	constructor(public authorizationService: AuthorizationService) {}

	ngOnInit(): void {
		this.verificationListener = this.authorizationService.getIsVerified().subscribe((isVerified) => {
			this.isVerified = isVerified;
		});

		this.messageListener = this.authorizationService.getMessage().subscribe((message) => {
			this.message = message;
		});

		if (window.location.href.slice(22, 34) === 'confirmation') {
			this.authorizationService.confirmEmail(window.location.href.slice(21));
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
	}
}
