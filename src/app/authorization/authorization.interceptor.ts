import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthorizationService } from './authorizarion.service';

@Injectable()
export class AuthorizationInterceptor implements HttpInterceptor {
	constructor(private authorizationService: AuthorizationService) {}

	intercept(req: HttpRequest<any>, next: HttpHandler) {
		const token = this.authorizationService.getToken();
		const request = req.clone({
			headers: req.headers.set('Authorization', 'Bearer ' + token)
		});

		return next.handle(request);
	}
}
