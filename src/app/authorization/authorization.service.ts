import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthorizationData } from './authorization.model';
import { Router } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { User } from '../users/user.model';
import { environment } from 'src/environments/environment';

const URL = environment.URL;

@Injectable({ providedIn: 'root' })
export class AuthorizationService {
	private token: string;
	private userID: string;
	private isAuthenticated = false;
	private tokenTimer: NodeJS.Timer;
	private authorizationStatus = new Subject<boolean>();
	private userScore = new Subject<any>();
	private isVerified = new Subject<boolean>();
	private message = new Subject<string>();
	private errorMessage = new Subject<string>();

	constructor(private http: HttpClient, private router: Router) {}

	getToken() {
		return this.token;
	}

	getUserID() {
		return this.userID;
	}

	getIsVerified() {
		return this.isVerified.asObservable();
	}

	getDatabaseEmails() {
		return this.http.get<{ emails: string[] }>(URL + '/users');
	}

	getIsAuthenticated() {
		return this.isAuthenticated;
	}

	getMessage() {
		return this.message.asObservable();
	}

	getErrorMessage() {
		return this.errorMessage.asObservable();
	}

	getAuthorizationStatus() {
		return this.authorizationStatus.asObservable();
	}

	calculateScores() {
		this.http.get(URL + '/users/leaderboard/calculate').subscribe((response) => {
			this.getScores();
		});
	}

	getScores() {
		this.http.get(URL + '/users/leaderboard/show/current').subscribe((response) => {
			this.userScore.next(response);
		});
	}

	getUserScore() {
		this.calculateScores();
		return this.userScore.asObservable();
	}

	getUsers(userID: string): Observable<User> {
		return this.http.get<User>(URL + '/users/' + userID);
	}

	createUser(email: string, password: string) {
		const Data: AuthorizationData = { email: email, password: password };
		return this.http.post<{ message: string; userID: string }>(URL + '/register', Data).subscribe(
			(response) => {
				this.message.next(response.message);
				this.router.navigate([ '/users/' + response.userID ]);
			},
			(HttpError) => {
				this.errorMessage.next(HttpError.error.message);
				this.authorizationStatus.next(false);
			}
		);
	}

	login(email: string, password: string) {
		const Data: AuthorizationData = { email: email, password: password };
		this.http.post<{ token: string; expiresIn: number; userID: string }>(URL + '/login', Data).subscribe(
			(response) => {
				this.token = response.token;
				if (response.token) {
					const expiresIn = response.expiresIn;
					this.setAuthorizationTimer(expiresIn);
					this.userID = response.userID;
					this.authorizationStatus.next(true);
					this.isAuthenticated = true;
					const currentTime = new Date().getTime();
					const expiresInDate = new Date(currentTime + expiresIn * 1000);
					this.saveAuthorizedData(this.token, expiresInDate, this.userID);
					this.router.navigate([ '/users/' + this.userID ]);
				}
			},
			(HttpError) => {
				this.errorMessage.next(HttpError.error.message);
				this.authorizationStatus.next(false);
			}
		);
	}

	automateAuthorization() {
		const authorizedData = this.getAuthorizationData();

		if (!authorizedData) {
			return;
		}

		const currentTime = new Date().getTime();
		const expiresIn = authorizedData.expirationDate.getTime() - currentTime;
		if (expiresIn > 0) {
			this.token = authorizedData.token;
			this.userID = authorizedData.userID;
			this.isAuthenticated = true;
			this.setAuthorizationTimer(expiresIn / 1000);
			this.authorizationStatus.next(true);
		}
	}

	logout() {
		this.token = null;
		this.userID = null;
		this.isAuthenticated = false;
		this.authorizationStatus.next(false);
		clearTimeout(this.tokenTimer);
		this.clearAuthorizedData();
		console.log(this.message);
		this.router.navigate([ '/authorization' ]);
		window.location.reload();
	}

	private setAuthorizationTimer(duration: number) {
		this.tokenTimer = setTimeout(() => {
			this.logout();
		}, duration * 1000);
	}

	private saveAuthorizedData(token: string, expirationDate: Date, userID: string) {
		localStorage.setItem('token', token);
		localStorage.setItem('expiration', expirationDate.toISOString());
		localStorage.setItem('userID', userID);
	}

	private clearAuthorizedData() {
		localStorage.removeItem('token');
		localStorage.removeItem('expiration');
		localStorage.removeItem('userID');
	}

	private getAuthorizationData() {
		const token = localStorage.getItem('token');
		const expirationDate = localStorage.getItem('expiration');
		const userID = localStorage.getItem('userID');

		if (!token || !expirationDate) {
			return;
		}

		return {
			token: token,
			expirationDate: new Date(expirationDate),
			userID: userID
		};
	}

	confirmEmail(url: string) {
		this.http.get<{ message: string }>(URL + url).subscribe(
			(response) => {
				this.isVerified.next(true);
			},
			(error) => {
				this.isVerified.next(false);
				console.log(error);
			}
		);
	}
}
