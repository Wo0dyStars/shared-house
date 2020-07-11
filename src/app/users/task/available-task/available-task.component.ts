import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AvailableTask } from './available-task.model';

@Component({
	selector: 'app-available-task',
	templateUrl: './available-task.component.html',
	styleUrls: [ './available-task.component.scss' ]
})
export class AvailableTaskComponent implements OnInit {
	availableTasks: AvailableTask[] = [];

	constructor(private http: HttpClient) {}

	ngOnInit(): void {
		this.getAvailableTasks();
		this.updateAvailableTasks();
	}

	getAvailableTasks() {
		this.http
			.get<{ tasks: AvailableTask[] }>('http://localhost:3000/users/availabletask/show')
			.subscribe((response) => {
				this.availableTasks = response.tasks;
			});
	}

	updateAvailableTasks() {
		this.http.get('http://localhost:3000/users/availabletask/update').subscribe((response) => {
			this.getAvailableTasks();
		});
	}
}
