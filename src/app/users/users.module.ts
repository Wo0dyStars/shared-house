import { NgModule } from '@angular/core';
import { UsersComponent } from './users.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { UsersRoutingModule } from './users-routing.module';

@NgModule({
	declarations: [ UsersComponent, UserProfileComponent ],
	imports: [ CommonModule, FormsModule, SharedModule, UsersRoutingModule ]
})
export class UsersModule {}
