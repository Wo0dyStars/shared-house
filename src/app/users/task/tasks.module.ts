import { NgModule } from '@angular/core';
import { TaskComponent } from './task.component';
import { AvailableTaskComponent } from './available-task/available-task.component';
import { SharedModule } from '../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@NgModule({
	declarations: [ TaskComponent, AvailableTaskComponent ],
	imports: [ CommonModule, FormsModule, SharedModule ]
})
export class TasksModule {}
