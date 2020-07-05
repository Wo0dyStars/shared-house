import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from './authorization/authorization.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: [ './app.component.scss' ]
})
export class AppComponent implements OnInit {
	constructor(private authorizationService: AuthorizationService) {}

	ngOnInit() {
		this.authorizationService.automateAuthorization();
	}
}
