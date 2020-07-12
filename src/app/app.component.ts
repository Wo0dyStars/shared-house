import { Component, OnInit, Output } from '@angular/core';
import { AuthorizationService } from './authorization/authorization.service';
import { HttpClient } from '@angular/common/http';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: [ './app.component.scss' ]
})
export class AppComponent implements OnInit {
	@Output() userScore: any = null;
	constructor(private authorizationService: AuthorizationService, private http: HttpClient) {}

	ngOnInit() {
		this.authorizationService.automateAuthorization();
		this.calculateScores();
	}

	calculateScores() {
		this.http.get('http://localhost:3000/users/leaderboard/calculate').subscribe((response) => {
			this.getScores();
		});
	}

	getScores() {
		this.http.get('http://localhost:3000/users/leaderboard/show/current').subscribe((response) => {
			this.userScore = response;
		});
	}
}
