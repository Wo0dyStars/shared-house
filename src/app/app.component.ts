import { Component, OnInit, Output, OnDestroy } from '@angular/core';
import { AuthorizationService } from './authorization/authorization.service';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: [ './app.component.scss' ]
})
export class AppComponent implements OnInit, OnDestroy {
	@Output() userScore: any = null;
	isAuthenticated: boolean = false;
	private authorizationListener: Subscription;
	private userScoreListener: Subscription;
	constructor(private authorizationService: AuthorizationService, private http: HttpClient) {}

	ngOnInit() {
		this.authorizationService.automateAuthorization();
		this.isAuthenticated = this.authorizationService.getIsAuthenticated();
		this.authorizationListener = this.authorizationService.getAuthorizationStatus().subscribe((isAuthenticated) => {
			this.isAuthenticated = isAuthenticated;
		});

		this.userScoreListener = this.authorizationService.getUserScore().subscribe((userScore) => {
			this.userScore = userScore;
		});
	}

	ngOnDestroy() {
		this.authorizationListener.unsubscribe();
		this.userScoreListener.unsubscribe();
	}
}
