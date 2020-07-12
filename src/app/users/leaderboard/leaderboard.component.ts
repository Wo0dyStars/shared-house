import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
	selector: 'app-leaderboard',
	templateUrl: './leaderboard.component.html',
	styleUrls: [ './leaderboard.component.scss' ]
})
export class LeaderboardComponent implements OnInit {
	leaderboard: any = [];
	userBoard: any = [];
	isLoading = false;

	constructor(private http: HttpClient) {}

	ngOnInit(): void {
		this.isLoading = true;
		this.getScores();
	}

	getScores() {
		this.http.get<{ leaderBoard: any }>('http://localhost:3000/users/leaderboard/show').subscribe((response) => {
			this.leaderboard = response.leaderBoard;

			response.leaderBoard.forEach((leaderboard) => {
				const userBoard = {
					name: leaderboard.userID.forename + ' ' + leaderboard.userID.surname,
					avatar: leaderboard.avatar,
					taskScore: leaderboard.scores[0].score,
					newsScore: leaderboard.scores[1].score,
					purchaseScore: leaderboard.scores[2].score,
					commentScore: leaderboard.scores[3].score
				};

				this.userBoard.push(userBoard);
			});

			this.isLoading = false;
		});
	}
}
