import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
	selector: 'app-news',
	templateUrl: './news.component.html',
	styleUrls: [ './news.component.scss' ]
})
export class NewsComponent implements OnInit {
	news: any = [];

	constructor(private http: HttpClient) {}

	ngOnInit(): void {
		this.getNews();
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
}
