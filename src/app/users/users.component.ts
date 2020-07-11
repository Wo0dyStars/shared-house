import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthorizationService } from '../authorization/authorization.service';

@Component({
	selector: 'app-users',
	templateUrl: './users.component.html',
	styleUrls: [ './users.component.scss' ]
})
export class UsersComponent implements OnInit {
	constructor(private http: HttpClient, private authorizationService: AuthorizationService) {}

	ngOnInit(): void {
		this.getUsers();
	}

	getUsers() {
		this.http
			.post('http://localhost:3000/users/show', { userID: this.authorizationService.getUserID() })
			.subscribe((response) => {
				console.log(response);
			});
	}
}
