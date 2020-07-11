import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AvailableTask } from './available-task.model';
import { AuthorizationService } from 'src/app/authorization/authorization.service';

@Component({
	selector: 'app-available-task',
	templateUrl: './available-task.component.html',
	styleUrls: [ './available-task.component.scss' ]
})
export class AvailableTaskComponent implements OnInit {
	availableTasks: AvailableTask[] = [];
	assignedTasks: any = [];
	userID: string = null;

	constructor(private http: HttpClient, private authorizationService: AuthorizationService) {}

	ngOnInit(): void {
		this.getAvailableTasks();
		this.updateAvailableTasks();
		this.getAssignedTasks();
		this.userID = this.authorizationService.getUserID();
	}

	getAvailableTasks() {
		this.http
			.get<{ tasks: AvailableTask[] }>('http://localhost:3000/users/availabletask/show')
			.subscribe((response) => {
				this.availableTasks = response.tasks;
			});
	}

	getAssignedTasks() {
		this.http
			.get<{ tasks: AvailableTask[] }>('http://localhost:3000/users/assignedtask/show')
			.subscribe((response) => {
				this.assignedTasks = response.tasks;
			});
	}

	updateAvailableTasks() {
		this.http.get('http://localhost:3000/users/availabletask/update').subscribe((response) => {
			this.getAvailableTasks();
		});
	}

	onAccept(availableTaskID: string) {
		this.http.get('http://localhost:3000/users/assignedtask/new/' + availableTaskID).subscribe((response) => {
			this.getAvailableTasks();
			this.getAssignedTasks();
		});
	}

	onComplete(assignedTaskID: string, availableTaskID: string) {
		this.http
			.post('http://localhost:3000/users/assignedtask/complete', {
				assignedTaskID: assignedTaskID,
				availableTaskID: availableTaskID
			})
			.subscribe((response) => {
				this.getAvailableTasks();
				this.getAssignedTasks();
			});
	}
}
