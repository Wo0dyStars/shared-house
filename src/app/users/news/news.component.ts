import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthorizationService } from 'src/app/authorization/authorization.service';
import { environment } from 'src/environments/environment';

const URL = environment.URL + '/users/';

@Component({
	selector: 'app-news',
	templateUrl: './news.component.html',
	styleUrls: [ './news.component.scss' ]
})
export class NewsComponent implements OnInit {
	news: any = [];
	userID: string = null;
	isLoading = false;
	message: string = '';

	constructor(private http: HttpClient, private authorizationService: AuthorizationService) {}

	ngOnInit(): void {
		this.message = '';
		this.getNews();
		this.userID = this.authorizationService.getUserID();
	}

	getNews() {
		this.isLoading = true;
		this.http.get<{ news: any }>(URL + 'news/show').subscribe((response) => {
			this.news = response.news;
			this.isLoading = false;
		});
	}

	onSubmit(form: NgForm) {
		const newsData = {
			title: form.value.title,
			message: form.value.message
		};

		this.http.post<{ message: string }>(URL + 'news/new', newsData).subscribe((response) => {
			this.message = response.message;
			this.getNews();
		});

		form.reset();
	}

	onSubmitComment(form: NgForm, newsID: string) {
		this.http
			.post(URL + 'news/comment/new', { message: form.value.message, newsID: newsID })
			.subscribe((response) => {
				this.getNews();
			});
	}

	onRemoveComment(commentID: string) {
		this.http.post(URL + 'news/comment/delete', { commentID: commentID }).subscribe((response) => {
			this.getNews();
		});
	}
}
