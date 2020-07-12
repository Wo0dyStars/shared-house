import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Task } from './task.model';

@Component({
	selector: 'app-task',
	templateUrl: './task.component.html',
	styleUrls: [ './task.component.scss' ]
})
export class TaskComponent implements OnInit {
	tasks: Task[] = [];
	isLoading = false;

	constructor(private http: HttpClient) {}

	ngOnInit(): void {
		this.getTasks();
	}

	getTasks() {
		this.isLoading = true;
		this.http.get<{ tasks: Task[] }>('http://localhost:3000/users/task/show').subscribe((response) => {
			this.tasks = response.tasks;
			this.isLoading = false;
		});
	}

	onSubmit(form: NgForm) {
		this.http.post('http://localhost:3000/users/task/new', { taskData: form.value }).subscribe((response) => {
			this.getTasks();
		});

		form.reset();
	}
}
