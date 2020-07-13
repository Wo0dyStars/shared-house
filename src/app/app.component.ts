import { Component, OnInit, Output, OnDestroy } from '@angular/core';
import { AuthorizationService } from './authorization/authorization.service';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: [ './app.component.scss' ]
})
export class AppComponent implements OnInit, OnDestroy {
	@Output() userScore: any = null;
	isAuthenticated: boolean = false;
	private authorizationListener: Subscription;

	userID: string = null;
	isLoading = false;

	constructor(private authorizationService: AuthorizationService, private http: HttpClient, private router: Router) {}

	ngOnInit() {
		this.isLoading = true;
		this.authorizationService.automateAuthorization();
		this.isAuthenticated = this.authorizationService.getIsAuthenticated();
		this.authorizationListener = this.authorizationService.getAuthorizationStatus().subscribe((isAuthenticated) => {
			this.isAuthenticated = isAuthenticated;
		});
		this.isLoading = false;
	}

	ngOnDestroy() {
		this.authorizationListener.unsubscribe();
	}
}
