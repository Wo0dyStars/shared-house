import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthorizationService } from 'src/app/authorization/authorization.service';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-user-profile',
	templateUrl: './user-profile.component.html',
	styleUrls: [ './user-profile.component.scss' ]
})
export class UserProfileComponent implements OnInit, OnDestroy {
	userData: any;
	subscription: Subscription;

	constructor(private authorizationService: AuthorizationService, private router: Router) {}

	ngOnInit() {
		this.subscription = this.getUserData().subscribe((res) => {
			this.userData = res;
		});
	}

	getUserData() {
		const userID = this.router.url.slice(7);
		return this.authorizationService.getUsers(userID);
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}
}
