import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AvailableTask } from './available-task.model';
import { AuthorizationService } from 'src/app/authorization/authorization.service';
import { environment } from 'src/environments/environment';

const URL = environment.URL + '/users/';

@Component({
	selector: 'app-available-task',
	templateUrl: './available-task.component.html',
	styleUrls: [ './available-task.component.scss' ]
})
export class AvailableTaskComponent implements OnInit {
	availableTasks: AvailableTask[] = [];
	assignedTasks: any = [];
	userID: string = null;
	isLoading = false;
	message: string = '';

	constructor(private http: HttpClient, private authorizationService: AuthorizationService) {}

	ngOnInit(): void {
		this.message = '';
		this.isLoading = true;
		this.getAvailableTasks();
		this.updateAvailableTasks();
		this.getAssignedTasks();
		this.userID = this.authorizationService.getUserID();
	}

	getAvailableTasks() {
		this.http.get<{ tasks: AvailableTask[] }>(URL + 'availabletask/show').subscribe((response) => {
			this.availableTasks = response.tasks;
		});
	}

	getAssignedTasks() {
		this.http.get<{ tasks: AvailableTask[] }>(URL + 'assignedtask/show').subscribe((response) => {
			this.assignedTasks = response.tasks;
			this.isLoading = false;
		});
	}

	updateAvailableTasks() {
		this.http.get(URL + 'availabletask/update').subscribe((response) => {
			this.getAvailableTasks();
		});
	}

	onAccept(availableTaskID: string) {
		this.http.get<{ message: string }>(URL + 'assignedtask/new/' + availableTaskID).subscribe((response) => {
			this.message = response.message;
			this.getAvailableTasks();
			this.getAssignedTasks();
		});
	}

	onComplete(assignedTaskID: string, availableTaskID: string) {
		this.http
			.post(URL + 'assignedtask/complete', {
				assignedTaskID: assignedTaskID,
				availableTaskID: availableTaskID
			})
			.subscribe((response) => {
				this.getAvailableTasks();
				this.getAssignedTasks();
			});
	}
}
