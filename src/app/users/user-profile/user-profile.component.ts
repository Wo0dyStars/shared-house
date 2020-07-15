import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthorizationService } from 'src/app/authorization/authorization.service';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const URL = environment.URL;
const imageURL = environment.imageURL;

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
	messageSuccess: string = null;
	messageError: string = null;
	updateSuccess: string = null;
	updateError: string = null;
	subscription: Subscription;
	userID = this.router.url.slice(7);
	isLoading = false;

	constructor(private authorizationService: AuthorizationService, private router: Router, private http: HttpClient) {}

	ngOnInit() {
		this.isLoading = true;
		this.subscription = this.getUserData().subscribe((res) => {
			this.userData = res;
			this.userData.movedIn = this.userData.movedIn.slice(0, 10);
			this.userData.lastUpdated = this.userData.lastUpdated.slice(0, 10);
			this.userData.birthday = this.userData.birthday.slice(0, 10);
			this.userAvatars.push(imageURL + '/images/avatar1.webp');
			this.userAvatars.push(imageURL + '/images/avatar2.png');
			this.userAvatars.push(imageURL + '/images/avatar3.webp');
			this.userAvatars.push(imageURL + '/images/avatar4.png');
			this.getUserLevel();
			this.isLoading = false;
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
		this.http.post<{ message: string; modifiedDate: Date }>(URL + '/users/edit/' + this.userID, saveData).subscribe(
			(response) => {
				this.userData[element.name] = element.value;
				this.userData.lastUpdated = response.modifiedDate;
				this.userData.lastUpdated = this.userData.lastUpdated.slice(0, 10);
				if (element.name === 'birthday') {
					this.userData.birthday = this.userData.birthday.slice(0, 10);
				}
				this.updateSuccess = response.message;
				this.updateError = null;
				this.getUserLevel();
			},
			(HttpError) => {
				this.updateError = HttpError.error.message;
				this.updateSuccess = null;
			}
		);
	}

	onSearchAddress(address: HTMLFormElement, postcode: HTMLFormElement) {
		if (postcode.value === '' || address.value === '') {
			this.messageError = 'You must provide your address and postcode for searching a house.';
		} else {
			let searchData = {
				addressName: address.name,
				addressValue: address.value,
				postcodeName: postcode.name,
				postcodeValue: postcode.value
			};

			this.http.post<{ message: string; matches: any }>(URL + '/users/address', searchData).subscribe(
				(response) => {
					this.searchedAddress = [];
					response.matches.forEach((user: any) => {
						let matchedUsers: any = {
							forename: user.forename,
							surname: user.surname,
							email: user.email
						};

						if (user.houseID) {
							matchedUsers.house = user.houseID.name;
							matchedUsers.houseID = user.houseID;
						}

						this.searchedAddress.push(matchedUsers);
					});
					this.messageSuccess = response.message;
					this.messageError = null;
				},
				(HttpError) => {
					this.messageError = HttpError.error.message;
					this.messageSuccess = null;
				}
			);
		}
	}

	onCreateHouse(housename: HTMLFormElement, postcode: HTMLFormElement, address: HTMLFormElement) {
		if (postcode.value === '' || address.value === '') {
			this.messageError = 'You must provide your address and postcode for creating a house.';
		} else {
			this.http
				.post<{ message: string }>(URL + '/users/house/create/' + this.userID, {
					housename: housename.value
				})
				.subscribe(
					(response) => {
						this.onSave(postcode);
						this.onSave(address);
						this.messageSuccess = response.message;
						this.messageError = null;
						setTimeout(() => {
							window.location.reload();
						}, 2500);
					},
					(HttpError) => {
						this.messageError = HttpError.error.message;
						this.messageSuccess = null;
					}
				);
		}
	}

	onJoinHouse(houseID: string) {
		this.http.get<{ message: string }>(URL + '/users/house/join/' + this.userID + '/' + houseID).subscribe(
			(response) => {
				this.messageSuccess = response.message;
				this.messageError = null;
			},
			(HttpError) => {
				this.messageError = HttpError.error.message;
				this.messageSuccess = null;
			}
		);
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}
}
