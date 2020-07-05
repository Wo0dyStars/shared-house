import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthorizationData } from './authorization.model';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthorizationService {
	constructor(private http: HttpClient, private router: Router) {}

	createUser(email: string, password: string) {
		const Data: AuthorizationData = { email: email, password: password };
		return this.http.post('http://localhost:3000/register', Data).subscribe(
			() => {
				this.router.navigate([ '/' ]);
			},
			(error) => {
				console.log('An error occurred ', error);
			}
		);
	}
}
