import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { AuthorizationService } from '../authorization/authorization.service';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: [ './header.component.scss' ]
})
export class HeaderComponent implements OnInit, OnDestroy {
	isAuthenticated: boolean = false;
	userID: string = null;
	isLoading = false;
	hasHouse: any = false;
	private userScoreListener: Subscription;
	@Input() userScore: any;
	private authorizationListener: Subscription;

	constructor(private authorizationService: AuthorizationService, private http: HttpClient) {}

	ngOnInit(): void {
		this.isLoading = true;
		this.isAuthenticated = this.authorizationService.getIsAuthenticated();
		this.authorizationListener = this.authorizationService.getAuthorizationStatus().subscribe((isAuthenticated) => {
			this.isAuthenticated = isAuthenticated;
		});
		this.userID = this.authorizationService.getUserID();

		this.authorizationService.getUsers(this.userID).subscribe((user) => {
			if (user.houseID) {
				this.userScoreListener = this.authorizationService.getUserScore().subscribe((userScore) => {
					this.userScore = userScore;
					this.isLoading = false;
					this.hasHouse = true;
				});
			} else {
				this.userScore = {
					name: user.forename + ' ' + user.surname,
					avatar: user.avatar,
					score: 0
				};
				this.isLoading = false;
			}
		});
	}

	onLogout() {
		this.authorizationService.logout();
	}

	ngOnDestroy() {
		this.authorizationListener.unsubscribe();
		this.userScoreListener.unsubscribe();
	}
}
