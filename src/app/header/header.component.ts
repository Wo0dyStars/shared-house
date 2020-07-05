import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthorizationService } from '../authorization/authorization.service';
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
		this.authorizationListener = this.authorizationService.getAuthorizationStatus().subscribe((isAuthenticated) => {
			this.isAuthenticated = isAuthenticated;
		});
	}

	onLogout() {
		this.authorizationService.logout();
	}

	ngOnDestroy() {
		this.authorizationListener.unsubscribe();
	}
}
