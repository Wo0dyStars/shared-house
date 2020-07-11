import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthorizationService } from '../authorization/authorization.service';
import { User } from './user.model';

@Component({
	selector: 'app-users',
	templateUrl: './users.component.html',
	styleUrls: [ './users.component.scss' ]
})
export class UsersComponent implements OnInit {
	users: User[] = [];
	house: string = null;

	constructor(private http: HttpClient, private authorizationService: AuthorizationService) {}

	ngOnInit(): void {
		this.getUsers();
	}

	getUsers() {
		this.http
			.post<{ message: string; housename: string; users: User[] }>('http://localhost:3000/users/show', {
				userID: this.authorizationService.getUserID()
			})
			.subscribe((response) => {
				this.users = response.users;
				this.house = response.housename;
			});
	}
}
