import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthorizationService } from 'src/app/authorization/authorization.service';

@Component({
	selector: 'app-news',
	templateUrl: './news.component.html',
	styleUrls: [ './news.component.scss' ]
})
export class NewsComponent implements OnInit {
	news: any = [];
	userID: string = null;

	constructor(private http: HttpClient, private authorizationService: AuthorizationService) {}

	ngOnInit(): void {
		this.getNews();
		this.userID = this.authorizationService.getUserID();
	}

	getNews() {
		this.http.get<{ news: any }>('http://localhost:3000/users/news/show').subscribe((response) => {
			this.news = response.news;
		});
	}

	onSubmit(form: NgForm) {
		const newsData = {
			title: form.value.title,
			message: form.value.message
		};

		this.http.post<{ news: any }>('http://localhost:3000/users/news/new', newsData).subscribe((response) => {
			this.getNews();
		});

		form.reset();
	}

	onSubmitComment(form: NgForm, newsID: string) {
		this.http
			.post('http://localhost:3000/users/news/comment/new', { message: form.value.message, newsID: newsID })
			.subscribe((response) => {
				this.getNews();
			});
	}

	onRemoveComment(commentID: string) {
		this.http
			.post('http://localhost:3000/users/news/comment/delete', { commentID: commentID })
			.subscribe((response) => {
				this.getNews();
			});
	}
}
