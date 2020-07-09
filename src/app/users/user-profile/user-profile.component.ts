import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthorizationService } from 'src/app/authorization/authorization.service';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { element } from 'protractor';

@Component({
	selector: 'app-user-profile',
	templateUrl: './user-profile.component.html',
	styleUrls: [ './user-profile.component.scss' ]
})
export class UserProfileComponent implements OnInit, OnDestroy {
	userData: any;
	userLevel: number = 0;
	userAvatars: string[] = [];
	searchedAddress: any[] = [];
	subscription: Subscription;
	userID = this.router.url.slice(7);

	constructor(private authorizationService: AuthorizationService, private router: Router, private http: HttpClient) {}

	ngOnInit() {
		this.subscription = this.getUserData().subscribe((res) => {
			this.userData = res;
			this.userData.movedIn = this.userData.movedIn.slice(0, 10);
			this.userData.lastUpdated = this.userData.lastUpdated.slice(0, 10);
			this.userData.birthday = this.userData.birthday.slice(0, 10);
			this.userAvatars.push('http://localhost:3000/images/avatar1.webp');
			this.userAvatars.push('http://localhost:3000/images/avatar2.png');
			this.userAvatars.push('http://localhost:3000/images/avatar3.webp');
			this.userAvatars.push('http://localhost:3000/images/avatar4.png');
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

		this.userLevel = parseFloat((level / length * 100).toFixed(2));
	}

	onSave(element: HTMLFormElement) {
		let saveData = { element: element.name, value: element.value };
		if (element.name === 'movedIn' || element.name === 'lastUpdated' || element.name === 'birthday') {
			saveData.value = new Date(element.value);
		}
		this.http
			.post<{ message: string; modifiedDate: Date }>('http://localhost:3000/users/edit/' + this.userID, saveData)
			.subscribe((response) => {
				this.userData[element.name] = element.value;
				this.userData.lastUpdated = response.modifiedDate;
				this.userData.lastUpdated = this.userData.lastUpdated.slice(0, 10);
				if (element.name === 'birthday') {
					this.userData.birthday = this.userData.birthday.slice(0, 10);
				}
				console.log(response.message);
				this.getUserLevel();
			});
	}

	onSearchAddress(address: HTMLFormElement, postcode: HTMLFormElement) {
		let searchData = {
			addressName: address.name,
			addressValue: address.value,
			postcodeName: postcode.name,
			postcodeValue: postcode.value
		};

		this.http
			.post<{ message: string; users: any }>('http://localhost:3000/users/address', searchData)
			.subscribe((response) => {
				response.users.forEach((user: any) => {
					let matchedUsers: any = {
						forename: user.forename,
						surname: user.surname,
						email: user.email
					};
					this.searchedAddress.push(matchedUsers);
				});
			});
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}
}
