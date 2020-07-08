import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthorizationService } from 'src/app/authorization/authorization.service';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
	selector: 'app-user-profile',
	templateUrl: './user-profile.component.html',
	styleUrls: [ './user-profile.component.scss' ]
})
export class UserProfileComponent implements OnInit, OnDestroy {
	userData: any;
	userLevel: number = 0;
	subscription: Subscription;
	userID = this.router.url.slice(7);

	constructor(private authorizationService: AuthorizationService, private router: Router, private http: HttpClient) {}

	ngOnInit() {
		this.subscription = this.getUserData().subscribe((res) => {
			this.userData = res;
			this.userData.movedIn = this.userData.movedIn.slice(0, 10);
			this.userData.lastUpdated = this.userData.lastUpdated.slice(0, 10);
			this.getUserLevel();
		});
	}

	getUserData() {
		return this.authorizationService.getUsers(this.userID);
	}

	getUserLevel() {
		let level: number = 0;
		let length: number = 0;
		for (let element in this.userData) {
			if (typeof this.userData[element] !== 'boolean' && element !== '_id' && element !== 'password') {
				length++;

				if (this.userData[element] !== undefined && this.userData[element] !== '') {
					level++;
				}
			}
		}

		this.userLevel = level / length * 100;
	}

	onSave(element: HTMLFormElement) {
		let saveData = { element: element.name, value: element.value };
		if (element.name === 'movedIn' || element.name === 'lastUpdated' || element.name === 'birthday') {
			saveData.value = new Date(element.value);
		}
		this.http.post('http://localhost:3000/users/edit/' + this.userID, saveData).subscribe((response) => {
			this.userData[element.name] = element.value;
			this.getUserLevel();
		});
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}
}
