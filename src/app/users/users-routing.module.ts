import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersComponent } from './users.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { TaskComponent } from './task/task.component';
import { AvailableTaskComponent } from './task/available-task/available-task.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { NewsComponent } from './news/news.component';

const routes: Routes = [
	{ path: '', component: UsersComponent },
	{ path: 'shopping-list', component: ShoppingListComponent },
	{ path: 'task', component: TaskComponent },
	{ path: 'news', component: NewsComponent },
	{ path: 'availabletask', component: AvailableTaskComponent },
	{ path: 'leaderboard', component: LeaderboardComponent },
	{ path: ':id', component: UserProfileComponent }
];

@NgModule({
	imports: [ RouterModule.forChild(routes) ]
})
export class UsersRoutingModule {}
