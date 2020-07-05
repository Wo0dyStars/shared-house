import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthorizationService } from '../authorization/authorizarion.service';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: [ './header.component.scss' ]
})
export class HeaderComponent implements OnInit, OnDestroy {
	isAuthenticated: boolean = false;
	private authorizationListener: Subscription;

	constructor(private authorizationService: AuthorizationService) {}

	ngOnInit(): void {
		this.isAuthenticated = this.authorizationService.getIsAuthenticated();
		console.log('Before getting info', this.isAuthenticated);
		this.authorizationListener = this.authorizationService.getAuthorizationStatus().subscribe((isAuthenticated) => {
			this.isAuthenticated = isAuthenticated;
		});
		console.log('After getting info', this.isAuthenticated);
	}

	ngOnDestroy() {
		this.authorizationListener.unsubscribe();
	}
}
