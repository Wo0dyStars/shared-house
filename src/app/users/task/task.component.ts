import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Task } from './task.model';
import { environment } from 'src/environments/environment';

const URL = environment.URL + '/users/';

@Component({
	selector: 'app-task',
	templateUrl: './task.component.html',
	styleUrls: [ './task.component.scss' ]
})
export class TaskComponent implements OnInit {
	tasks: Task[] = [];
	isLoading = false;
	message: string = '';

	constructor(private http: HttpClient) {}

	ngOnInit(): void {
		this.getTasks();
	}

	getTasks() {
		this.message = '';
		this.isLoading = true;
		this.http.get<{ tasks: Task[] }>(URL + 'task/show').subscribe((response) => {
			this.tasks = response.tasks;
			this.isLoading = false;
		});
	}

	onSubmit(form: NgForm) {
		this.http.post<{ message: string }>(URL + 'task/new', { taskData: form.value }).subscribe((response) => {
			this.getTasks();
			this.message = response.message;
		});

		form.reset();
	}
}
