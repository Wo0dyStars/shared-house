import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
	selector: 'app-leaderboard',
	templateUrl: './leaderboard.component.html',
	styleUrls: [ './leaderboard.component.scss' ]
})
export class LeaderboardComponent implements OnInit {
	constructor(private http: HttpClient) {}

	ngOnInit(): void {
		this.getScores();
	}

	getScores() {
		this.http.get('http://localhost:3000/users/leaderboard/show').subscribe((response) => {
			console.log(response);
		});
	}
}
